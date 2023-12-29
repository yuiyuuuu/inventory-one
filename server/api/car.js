const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const { getUser } = require("./helper/getUser.js");
const { carIncludes } = require("./includes.js");

const { car_tracker_input_status } = require("@prisma/client");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  const user = await getUser(req.headers.authorization);

  if (!user?.id) {
    res.send("Internal Server Error").status(500);
    return;
  }

  try {
    const find = await prisma.carTracker.findMany({
      include: JSON.parse(carIncludes),
    });

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchone/:id", async (req, res, next) => {
  const user = await getUser(req.headers.authorization);

  if (!user?.id) {
    res.send("Internal Server Error").status(500);
    return;
  }

  try {
    const find = await prisma.carTracker.findUnique({
      where: {
        id: req.params.id,
      },

      include: JSON.parse(carIncludes),
    });

    if (!find) {
      res.send("not found").status(200);
      return;
    }

    res.send(find).status(200);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  const user = await getUser(req.headers.authorization);

  if (!user?.id) {
    res.send("Internal Server Error").status(500);
    return;
  }

  try {
    const create = await prisma.carTracker.create({
      data: {
        name: req.body.name,
        plate: req.body.plate,
      },

      include: JSON.parse(carIncludes),
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});

router.post("/createinput", async (req, res, next) => {
  const user = await getUser(req.headers.authorization);

  if (!user?.id) {
    res.send("Internal Server Error").status(500);
    return;
  }

  try {
    const create = await prisma.carTrackerInput.create({
      data: {
        carTracker: {
          connect: {
            id: req.body.car.id,
          },
        },
        takenBy: req.body.name,
        other: req.body.memo,

        //false= not damaged, true = damaged
        oilStatus: !req.body.oilStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        tireStatus: !req.body.tireStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        windShieldWipersStatus: !req.body.windShieldWipersStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        bodyStatus: !req.body.bodyStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        lightStatus: !req.body.lightStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
      },
    });

    const findTracker = await prisma.carTracker.findUnique({
      where: {
        id: req.body.car.id,
      },

      include: JSON.parse(carIncludes),
    });

    res.send(findTracker);
  } catch (error) {
    next(error);
  }
});

//return car, change car tracker input
router.put("/return", async (req, res, next) => {
  const user = await getUser(req.headers.authorization);

  if (!user?.id) {
    res.send("Internal Server Error").status(500);
    return;
  }

  try {
    const update = await prisma.carTrackerInput.update({
      where: {
        id: req.body.currentInput.id,
      },

      data: {
        //name will not be updated
        oilStatus: !req.body.oilStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        tireStatus: !req.body.tireStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        windShieldWipersStatus: !req.body.windShieldWipersStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        bodyStatus: !req.body.bodyStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        lightStatus: !req.body.lightStatus
          ? car_tracker_input_status.notdamaged
          : car_tracker_input_status.damaged,
        other: req.body.memo,
        returnTime: new Date().toISOString(),
      },
    });

    const find = await prisma.carTracker.findUnique({
      where: {
        id: req.body.car.id,
      },

      include: JSON.parse(carIncludes),
    });

    res.send(find);
  } catch (error) {
    next(error);
  }
});
