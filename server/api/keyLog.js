const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const data = await prisma.keylog.findMany({
      include: {
        store: true,
      },
    });

    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const data = await prisma.keylog.create({
      data: {
        name: req.body.name,
        memo: req.body.memo || null,
        takeTime: req.body.takeTime,
        storeId: req.body.storeId,
      },
    });

    const store = await prisma.store.findUnique({
      where: {
        id: req.body.storeId,
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

        keyLog: true,
      },
    });

    res.send(store);
  } catch (error) {
    next(error);
  }
});

router.put("/return", async (req, res, next) => {
  try {
    await prisma.keylog.update({
      where: {
        id: req.body.keyLogId,
      },
      data: {
        returnTime: req.body.returnTime,
      },
    });

    const store = await prisma.store.findUnique({
      where: {
        id: req.body.storeId,
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

        keyLog: true,
      },
    });

    res.send(store);
  } catch (error) {
    next(error);
  }
});
