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
    const stores = await prisma.store.findMany({
      include: JSON.parse(store),
    });

    res.send(stores);
  } catch (error) {
    next(error);
  }
});

router.get("/fetch/:id", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const findstore = await prisma.store.findUnique({
      where: {
        id: req.params.id,
      },
      include: JSON.parse(store),
    });

    if (findstore?.id) {
      res.send(findstore);
    } else {
      res.send("not found");
    }
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

router.get("/fetchall/golyek", async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        keyLog: true,
        keyImage: true,
      },
    });

    res.send(stores);
  } catch (error) {
    next(error);
  }
});
