const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");
const { getUser } = require("./helper/getUser.js");

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
        memo: req.body.memo,
        visitors: req.body.visitors,
      },

      include: {
        user: true,
        store: true,
      },
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});

//delete a visit
router.post("/delete", async (req, res, next) => {
  const user = await getUser(req.headers.authorization);

  if (!user?.id) {
    res.send("Internal Server Error").status(500);
    return;
  }

  try {
    await prisma.visitTracker.delete({
      where: {
        id: req.body.id,
      },
    });

    res.send("deleted");
  } catch (error) {
    next(error);
  }
});
