const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetch/:id", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const find = await prisma.qR.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        user: true,
      },
    });

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchredirect/:id", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const find = await prisma.qR.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        user: true,
      },
    });

    await prisma.qR.update({
      where: {
        id: req.params.id,
      },

      data: {
        count: find.count + 1,
      },
    });

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const { name, url, user } = req.body;

    const create = await prisma.qR.create({
      data: {
        name,
        link: url,
        userid: user,
      },
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});

router.put("/addimg", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const update = await prisma.qR.update({
      where: {
        id: req.body.id,
      },
      data: {
        image: req.body.src,
      },
    });

    res.send(update);
  } catch (error) {
    next(error);
  }
});

router.put("/editqr", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const { name, link } = req.body;

    const update = await prisma.qR.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: name,
        link: link,
      },
    });

    res.send(update);
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteqr/:id", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const del = await prisma.qR.delete({
      where: {
        id: req.params.id,
      },
    });

    res.send(del);
  } catch (error) {
    next(error);
  }
});
