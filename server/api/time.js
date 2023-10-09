const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.post("/create", async (req, res, next) => {
  try {
    const create = await prisma.timeTracker.create({
      data: {
        name: req.body.name,
        userId: req.body.userid,
      },
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});
