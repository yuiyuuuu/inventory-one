const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/:id", async (req, res, next) => {
  try {
    const list = await prisma.list.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        item: {
          include: {
            orders: {
              include: {
                user: true,
                store: true,
              },
            },
            category: true,
          },
        },

        owner: true,
        sharedUsers: true,
        category: {
          include: {
            items: true,
          },
        },
      },
    });

    res.send(list);
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
      .then(() => {
        res.send("added");
      });
  } catch (error) {
    next(error);
  }
});
