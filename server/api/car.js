const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const find = await prisma.carTracker.findMany();

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const create = await prisma.carTracker.create({
      data: {
        name: req.body.name,
        plate: req.body.plate,
      },
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});
