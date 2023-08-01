const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const { list } = require("./includes");

module.exports = router;

router.get("/:id/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const send = await prisma.list.findUnique({
      where: {
        id: req.params.id,
      },

      include: JSON.parse(list),
    });

    if (!send?.id) {
      res.send("not found");
    }

    res.send(send);
  } catch (error) {
    next(error);
  }
});

//this post sends back user to set auth state
router.post("/create/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    await prisma.list
      .create({
        data: {
          name: req.body.name,
          ownerId: req.body.userid,
        },
      })
      .then(async () => {
        const findUser = await prisma.user.findUnique({
          where: {
            id: req.body.userid,
          },
          include: {
            lists: true,
            sharedLists: true,
            orders: true,
          },
        });

        res.send(findUser);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/category/create/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    await prisma.category
      .create({
        data: {
          listId: req.body.listid,
          name: req.body.name,
        },
      })
      .then(async () => {
        const send = await prisma.list.findUnique({
          where: {
            id: req.body.listid,
          },
          include: JSON.parse(list),
        });

        res.send(send);
      });
  } catch (error) {
    next(error);
  }
});

router.put("/sharelist/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!findUser?.id) {
      res.send("user not found");
      return;
    }

    const update = await prisma.list.update({
      where: {
        id: req.body.id,
      },
      data: {
        sharedUsers: {
          connect: [{ id: findUser.id }],
        },
      },
    });

    res.send({ list: update, user: findUser }).status(200);
  } catch (error) {
    next(error);
  }
});
