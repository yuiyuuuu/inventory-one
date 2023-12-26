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
