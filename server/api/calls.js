const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

const { calls: callsInclude } = require("./includes");

router.get("/fetchall", async (req, res, next) => {
  try {
    const find = await prisma.callLog.findMany({
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
  try {
    const create = await prisma.callLog.create({
      data: {
        storeId: req.body.storeId,
        body: req.body.body,
        title: req.body.title,
        name: req.body.name,
        createdAt:
          new Date(req.body.time).toISOString() || new Date().toISOString(),
      },
    });

    res.send({ create: create, storeId: req.body.storeId });
  } catch (error) {
    next(error);
  }
});

router.put("/edit", async (req, res, next) => {
  try {
    const update = await prisma.callLog.update({
      where: {
        id: req.body.id,
      },
      data: {
        storeId: req.body.storeId,
        body: req.body.body,
        title: req.body.title,
        name: req.body.name,
        createdAt:
          new Date(req.body.time).toISOString() || new Date().toISOString(),
      },
    });

    res.send(update);
  } catch (error) {
    next(error);
  }
});
