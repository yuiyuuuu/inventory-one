const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const data = await prisma.item.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.send(data);
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
      },
    });

    res.send(item);
  } catch (error) {
    next(error);
  }
});

router.put("/editqty/one", async (req, res, next) => {
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
          quantity: find.quantity + 1,
        },
      });
    } else {
      //prevent negative qty
      const willGoNegative = find.quantity - 1 < 0;
      if (willGoNegative) return;

      await prisma.item.update({
        where: {
          id: req.body.id,
        },
        data: {
          quantity: find.quantity - 1,
        },
      });
    }

    const final = await prisma.item.findUnique({ where: { id: req.body.id } });

    res.send(final);
  } catch (error) {
    next(error);
  }
});
