const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const { store } = require("./includes.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

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

router.get("/fetch/active", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const find = await prisma.keylog.findMany({
      where: {
        returnTime: {
          equals: null,
        },
      },

      include: {
        store: true,
      },
    });

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const listOfKeys = req.body.stores;

    for (let i = 0; i < listOfKeys.length; i++) {
      await prisma.keylog.create({
        data: {
          name: req.body.name,
          memo: req.body.memo || null,
          takeTime: req.body.takeTime,
          storeId: listOfKeys[i].id,
        },
      });
    }

    //sends the first store in the list
    const store = await prisma.store.findUnique({
      where: {
        id: listOfKeys[0].id,
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
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

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

//this one returns all active ones, the other one returns the store
router.put("/returnfromoverlay", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    await prisma.keylog.update({
      where: {
        id: req.body.keyLogId,
      },
      data: {
        returnTime: req.body.returnTime,
      },
    });

    const find = await prisma.keylog.findMany({
      where: {
        returnTime: {
          equals: null,
        },
      },

      include: {
        store: true,
      },
    });

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.post("/addimage", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const images = req.body.images;

    for (let i = 0; i < images.length; i++) {
      await prisma.keyimage.create({
        data: {
          image: images[i].image,
          storeId: req.body.storeId,
        },
      });
    }

    const s = await prisma.store.findUnique({
      where: {
        id: req.body.storeId,
      },

      include: JSON.parse(store),
    });

    res.send(s).status(200);
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteimage/:id/:storeid", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    await prisma.keyimage.delete({
      where: {
        id: req.params.id,
      },
    });

    const s = await prisma.store.findUnique({
      where: {
        id: req.params.storeid,
      },

      include: JSON.parse(store),
    });

    res.send(s).status(200);
  } catch (error) {
    next(error);
  }
});
