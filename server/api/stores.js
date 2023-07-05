const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany({
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

        keyLog: true,
      },
    });

    res.send(store);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchbylistandstore/:listid/:storeid", async (req, res, next) => {
  const listid = req.params.listid;
  const storeid = req.params.storeid;

  const findList = await prisma.list.findUnique({
    where: {
      id: listid,
    },
    include: {
      item: {
        where: {},
      },
    },
  });
});
