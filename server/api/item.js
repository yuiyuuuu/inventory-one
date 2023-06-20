const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const data = await prisma.item.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        orders: {
          include: {
            user: true,
            store: true,
          },
        },
      },
    });

    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/create/mass", async (req, res, next) => {
  try {
    const arr = req.body;

    const v = new Promise((resolve, reject) => {
      arr.forEach(async (item, index, array) => {
        await prisma.item.create({
          data: item,
        });

        if (index === array.length - 1) resolve();
      });
    });

    v.then(async () => {
      const fetchall = await prisma.item.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          orders: {
            include: {
              user: true,
              store: true,
            },
          },
        },
      });

      res.send(fetchall).status(200);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const body = req.body;

    const item = await prisma.item.create({
      data: {
        name: body.name,
        quantity: body.quantity || 0,
        image: body.image || null,
        units: req.body.units || null,
      },

      include: {
        orders: {
          include: {
            user: true,
            store: true,
          },
        },
      },
    });

    res.send(item);
  } catch (error) {
    next(error);
  }
});

router.put("/editqty", async (req, res, next) => {
  try {
    const find = await prisma.item.findUnique({
      where: {
        id: req.body.id,
      },
    });

    if (req.body.which === "add") {
      await prisma.item.update({
        where: {
          id: req.body.id,
        },
        data: {
          quantity: find.quantity + req.body.quantity,
        },
      });
    } else {
      let negativeStock = null;
      //prevent negative qty
      const willGoNegative = find.quantity - req.body.quantity < 0;
      if (willGoNegative) {
        negativeStock = find.quantity;

        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            quantity: 0, //if it will go negative,just set qty to 0
          },
        });
      } else {
        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            quantity: find.quantity - req.body.quantity,
          },
        });
      }

      await prisma.order.create({
        data: {
          itemId: req.body.id,
          storeId: req.body.storeId,
          userId: await prisma.user.findUnique({
            where: { name: req.body.user },
          }),
          quantity: negativeStock || req.body.quantity,
          completedAt: "", //FIX THIS TOMORROW FIRST THING, CHANGE ALL DATES TO TIMESTAMPS
        },
      });
    }

    const final = await prisma.item.findUnique({
      where: { id: req.body.id },
      include: {
        orders: {
          include: {
            user: true,
            store: true,
          },
        },
      },
    });

    res.send(final);
  } catch (error) {
    next(error);
  }
});

router.put("/edit/info", async (req, res, next) => {
  try {
    const update = await prisma.item.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        quantity: req.body.quantity,
        image: req.body.image,
        units: req.body.units || null,
      },
      include: {
        orders: {
          include: {
            user: true,
            store: true,
          },
        },
      },
    });

    res.send(update);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    await prisma.item.delete({
      where: {
        id: req.params.id,
      },
    });

    res.send("success");
  } catch (error) {
    next(error);
  }
});
