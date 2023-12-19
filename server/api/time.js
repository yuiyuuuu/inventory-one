const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const jwt = require("jsonwebtoken");

module.exports = router;

router.post("/addhistory", async (req, res, next) => {
  try {
    await prisma.timeLog.create({
      data: {
        trackerId: req.body.trackerid,
        timeIn: new Date(req.body.timein).toISOString(),
        timeOut: new Date(req.body.timeout).toISOString(),
        memo: req.body.memo,
      },
    });

    const send = await prisma.timeTracker.findUnique({
      where: {
        id: req.body.trackerid,
      },

      include: {
        history: true,
      },
    });

    res.send(send);
  } catch (error) {
    next(error);
  }
});

router.post("/getone", async (req, res, next) => {
  try {
    const id = req.body.id;
    const auth = req.body.auth;

    const j = jwt.verify(req.body.auth, process.env.JWT);

    const finduser = await prisma.user.findUnique({
      where: {
        id: j.iat ? j.id : j,
      },
      include: {
        TimeTracker: true,
      },
    });

    if (finduser.TimeTracker.map((v) => v.id).includes(id)) {
      res.send(
        await prisma.timeTracker.findUnique({
          where: {
            id: id,
          },
          include: {
            history: true,
          },
        })
      );
    } else {
      res.send("unauthorized");
    }
  } catch (error) {
    next(error);
  }
});

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

router.post("/deleteone", async (req, res, next) => {
  try {
    const del = await prisma.timeLog.delete({
      where: {
        id: req.body.id,
      },
    });

    res.send("deleted");
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

      data: { currentTimeIn: { set: null } },

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
