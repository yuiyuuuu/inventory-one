const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany();

    res.send(stores);
  } catch (error) {
    next(error);
  }
});

router.get("/fetch/:id", async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        orders: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
            user: true,
          },
        },
      },
    });

    res.send(store);
  } catch (error) {
    next(error);
  }
});
