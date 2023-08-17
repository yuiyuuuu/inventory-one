const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const { item: itemIncludes } = require("./includes.js");

module.exports = router;

router.get("/fetch/:id", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const item = await prisma.item.findUnique({
      where: {
        id: req.params.id,
      },
      include: JSON.parse(itemIncludes),
    });

    res.send(item);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchall", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const data = await prisma.item.findMany({
      orderBy: {
        name: "asc",
      },
      include: JSON.parse(itemIncludes),
    });

    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/create/mass", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const arr = req.body.result;
    const listid = req.body.listid;

    const v = new Promise((resolve, reject) => {
      arr.forEach(async (item, index, array) => {
        if (!item.name) return;
        await prisma.item.create({
          data: { ...item, listId: listid, categoryId: req.body.category.id },
        });

        if (index === array.length - 1) resolve();
      });
    });

    v.then(async () => {
      const list = await prisma.list.findUnique({
        where: {
          id: listid,
        },
        include: {
          item: {
            include: JSON.parse(itemIncludes),
          },
        },
      });

      res.send(list).status(200);
    });
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
    const body = req.body;

    const item = await prisma.item.create({
      data: {
        name: body.name,
        quantity: body.quantity || 0,
        image: body.image || null,
        units: req.body.units || null,
        listId: req.body.listid,
        categoryId: req.body.categoryId,
        //this below should be categoryid and connect it to category
        // category: req.body.category || "General Supply",
      },

      include: JSON.parse(itemIncludes),
    });

    const list = await prisma.list.findUnique({
      where: {
        id: req.body.listid,
      },
      include: {
        item: {
          include: JSON.parse(itemIncludes),
        },
      },
    });

    res.send(list);
  } catch (error) {
    next(error);
  }
});

router.put("/editqty", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const find = await prisma.item.findUnique({
      where: {
        id: req.body.id,
      },
    });

    if (req.body.which === "add") {
      if (!req.body.dontAddQty) {
        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            quantity: find.quantity + req.body.quantity,
          },
        });
      }

      if (req.body.isShipment) {
        await prisma.shipment.create({
          data: {
            store: req.body.shipmentStore,
            quantity: req.body.quantity,
            orderLink: req.body.shipmentLink,
            shipmentDate: new Date(req.body.shipmentDate).toISOString(),

            itemId: req.body.id,
          },
        });
      }
    } else {
      let negativeStock = null;
      //prevent negative qty
      const willGoNegative = find.quantity - req.body.quantity < 0;

      if (willGoNegative) {
        negativeStock = find.quantity;

        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            quantity: 0, //if it will go negative,just set qty to 0
          },
        });
      } else {
        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            quantity: find.quantity - req.body.quantity,
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: req.body.userid,
        },
      });

      if (find.quantity > 0) {
        await prisma.order.create({
          data: {
            itemId: req.body.id,
            storeId: req.body.storeId,
            userId: user.id,
            quantity: negativeStock || req.body.quantity,
            completedAt: new Date(),
            listId: req.body.listid,
          },
        });

        await prisma.item.update({
          where: {
            id: req.body.id,
          },
          data: {
            historyQTY: find.historyQTY + (negativeStock || req.body.quantity),
          },
        });
      }
    }

    const final = await prisma.item.findUnique({
      where: { id: req.body.id },
      include: JSON.parse(itemIncludes),
    });

    res.send(final);
  } catch (error) {
    next(error);
  }
});

router.put("/edit/info", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const update = await prisma.item.update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        quantity: req.body.quantity,
        image: req.body.image,
        units: req.body.units || null,
      },
      include: JSON.parse(itemIncludes),
    });

    res.send(update);
  } catch (error) {
    next(error);
  }
});

//route only used for supply inventory list since those items are seeded and not manually added
router.all("/external/editqty", async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  const body = req.body;

  const user = await prisma.user.findFirst({
    where: {
      name: "HR @ Palm",
    },
  });

  const list = await prisma.list.findFirst({
    where: {
      name: "Supply Inventory List",
    },
  });

  for (let i = 0; i < req.body.items?.length || 0; i++) {
    const cur = body.items[i];

    const finditem = await prisma.item.findFirst({
      where: {
        seedid: cur.id,
      },
    });

    if (!finditem?.id) continue;

    const store = await prisma.store.findFirst({
      where: {
        number: parseInt(body.store),
      },
    });

    await prisma.item.update({
      where: {
        seedid: cur.id,
      },

      data: {
        quantity:
          finditem.quantity - cur.qty >= 0 ? finditem.quantity - cur.qty : 0,
        historyQTY: finditem.historyQTY + Number(cur.qty),
      },
    });

    await prisma.order.create({
      data: {
        itemId: finditem.id,
        storeId: store.id,
        listId: list.id,
        userId: user.id,
        quantity: Number(cur.qty),
        completedAt: new Date(),
      },
    });
  }

  res.send("updated").status(200);
});

router.delete("/delete/:id", async (req, res, next) => {
  if (req.headers.authorization !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    await prisma.item.delete({
      where: {
        id: req.params.id,
      },
    });

    res.send("success");
  } catch (error) {
    next(error);
  }
});
