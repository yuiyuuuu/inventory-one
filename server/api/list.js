const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const { list } = require("./includes");

module.exports = router;

router.get("/:id", async (req, res, next) => {
  try {
    const send = await prisma.list.findUnique({
      where: {
        id: req.params.id,
      },

      include: JSON.parse(list),
    });

    res.send(send);
  } catch (error) {
    next(error);
  }
});

//this post sends back user to set auth state
router.post("/create", async (req, res, next) => {
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

router.post("/category/create", async (req, res, next) => {
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
