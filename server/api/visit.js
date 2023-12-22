const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/getall", async (req, res, next) => {
  try {
    const trackers = await prisma.visitTracker.findMany({
      include: {
        user: true,
        store: true,
      },
    });

    res.send(trackers);
  } catch (error) {
    next(error);
    res.send("Internal Server Error").status(500);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const create = await prisma.visitTracker.create({
      data: {
        store: {
          connect: {
            id: req.body.storeId,
          },
        },
        user: {
          connect: {
            id: req.body.userId,
          },
        },
        actionTime: new Date(req.body.date).toISOString(),
        memo: req.body.body,
      },
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});
