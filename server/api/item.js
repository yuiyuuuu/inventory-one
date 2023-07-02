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
        category: true,
      },
    });

    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/create/mass", async (req, res, next) => {
  try {
    const arr = req.body.result;
    const listid = req.body.listid;

    const v = new Promise((resolve, reject) => {
      arr.forEach(async (item, index, array) => {
        if (!item.name) return;
        await prisma.item.create({
          data: { ...item, listId: listid },
        });

        if (index === array.length - 1) resolve();
      });
    });

    v.then(async () => {
      const list = await prisma.list.findUnique({
        where: {
          id: listid,
        },
        include: {
          item: {
            include: {
              orders: {
                include: {
                  user: true,
                  store: true,
                },
              },
              category: true,
            },
          },
        },
      });

      res.send(list).status(200);
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
        listId: req.body.listid,
        categoryId: req.body.categoryId,
        //this below should be categoryid and connect it to category
        // category: req.body.category || "General Supply",
      },

      include: {
        orders: {
          include: {
            user: true,
            store: true,
          },
        },
        category: true,
      },
    });

    const list = await prisma.list.findUnique({
      where: {
        id: req.body.listid,
      },
      include: {
        item: {
          include: {
            orders: {
              include: {
                user: true,
                store: true,
              },
            },
            category: true,
          },
        },
      },
    });

    res.send(list);
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

      const user = await prisma.user.findUnique({
        where: {
          name: req.body.user,
        },
      });

      if (find.quantity > 0) {
        await prisma.order.create({
          data: {
            itemId: req.body.id,
            storeId: req.body.storeId,
            userId: user.id,
            quantity: negativeStock || req.body.quantity,
            completedAt: new Date(),
          },
        });

        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            historyQTY: find.historyQTY + (negativeStock || req.body.quantity),
          },
        });
      }
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
        category: true,
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
        category: true,
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
