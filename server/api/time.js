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

router.put("/clockin", async (req, res, next) => {
  try {
    const update = await prisma.timeTracker.update({
      where: {
        id: req.body.id,
      },

      data: {
        currentTimeIn: new Date().toISOString(),
      },

      include: {
        history: true,
      },
    });

    res.send(update);
  } catch (error) {
    next(error);
  }
});

router.put("/clockout", async (req, res, next) => {
  try {
    const find = await prisma.timeTracker.findUnique({
      where: {
        id: req.body.id,
      },
    });

    await prisma.timeLog.create({
      data: {
        timeIn: find.currentTimeIn,
        timeOut: new Date().toISOString(),
        trackerId: find.id,
      },
    });

    const send = await prisma.timeTracker.update({
      where: {
        id: req.body.id,
      },

      data: { currentTimeIn: null },

      include: {
        history: true,
      },
    });

    res.send(send);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    await prisma.timeTracker.delete({
      where: {
        id: req.params.id,
      },
    });

    res.send("deleted");
  } catch (error) {
    next(error);
  }
});
