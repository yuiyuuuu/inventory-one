const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

const { calls: callsInclude } = require("./includes");

router.get("/fetchall", async (req, res, next) => {
  try {
    const find = await prisma.callLog.findMany();

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
      },
    });

    res.send({ create: create, storeId: req.body.storeId });
  } catch (error) {
    next(error);
  }
});
