const prisma = require("./prismaClient");

const { c } = require("../jsonobj");

const bcrypt = require("bcrypt");

//IMPORTANT
//for later on when you recount inventory, before deleting everything, store the previous qty here and then we can reseed with the previous qty.
// that way we get the new updates and dont have to recount inventory
//will applythis when i recount inventory since I havent updated in so long

const stores = {
  1: "01-MAIN H/Q",
  2: "02-COM-1",
  3: "03-MAD-1",
  4: "04-MAD-2",
  5: "05-MILWAUKEE",
  7: "07-47TH-E",
  8: "08-HARVEY",
  9: "09-WILSON",
  11: "11-111TH",
  12: "12-HS-47",
  13: "13-65TH",
  14: "14-CHICAGO",
  15: "15-63RD",
  16: "16-71ST",
  17: "17-GARY",
  18: "18-NORTH",
  21: "21-87TH",
  22: "22-COM-2",
  26: "26-BLACKROSE",
  27: "27-JOLIET",
  28: "28-113TH",
  30: "30-116TH",
  31: "31-BOLINGBROOK",
  32: "32-OMEGA",
};

function sorting(a, b) {
  const aTime = Date.parse(a.COMPLETE_DATE);
  const bTime = Date.parse(b.COMPLETE_DATE);

  return aTime - bTime;
}

const findqty = async () => {
  // const group = {};

  // c.slice().forEach((v) => {
  //   group[v.SUPPLY_NUM] ||= {
  //     //later we can use the prisma auto gen id
  //     id: v.SUPPLY_NUM, //temp id, so we dont have duplicate items
  //     name: v.C_TITLE,
  //     quantity: 0,
  //     completedDates: [],
  //   };

  //   group[v.SUPPLY_NUM].quantity = group[v.SUPPLY_NUM].quantity + v.QTY;

  //   // if (group[v.SUPPLY_NUM].completedDates.length > 20)
  //   //   group[v.SUPPLY_NUM].completedDates.shift();

  //   const find = group[v.SUPPLY_NUM].completedDates.findIndex(
  //     (ob) => ob?.completedTime === v.COMPLETE_DATE
  //   );

  //   if (find < 0) {
  //     group[v.SUPPLY_NUM].completedDates.push({
  //       completedTime: v.COMPLETE_DATE,
  //       completedTimeStamp: new Date(v.COMPLETE_DATE).getTime(),
  //       qty: v.QTY,
  //       completedBy: v.COMPLETE_ID,
  //     });
  //   } else {
  //     group[v.SUPPLY_NUM].completedDates[find] = {
  //       ...group[v.SUPPLY_NUM].completedDates[find],
  //       qty: group[v.SUPPLY_NUM].completedDates[find].qty + v.QTY,
  //     };
  //   }

  //   group[v.SUPPLY_NUM].lastCompletedPerson = v.COMPLETE_ID;
  // });

  // return group;
  const findOldQty = await prisma.user.findUnique({
    where: {
      email: "yingsonyu@gmail.com",
    },
    include: {
      lists: {
        include: {
          item: true,
        },
      },
    },
  });

  console.log(findOldQty, "finddddddddddddd");

  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();
  await prisma.order.deleteMany();
  await prisma.keylog.deleteMany();
  await prisma.category.deleteMany();
  await prisma.list.deleteMany();

  const jack = await prisma.user.create({
    data: {
      name: "Jack",
      email: "yingsonyu@gmail.com",
      password: await bcrypt.hash("1234567890", 10),
    },
  });

  const firstList = await prisma.list.create({
    data: {
      name: "Supply Inventory List",
      ownerId: jack.id,
    },
  });

  for (let i = 0; i < c.length; i++) {
    const cur = c[i];

    const category = await prisma.category.upsert({
      where: {
        name: cur.M_ITEM_T,
      },
      create: {
        name: cur.M_ITEM_T,
        listId: firstList.id,
      },
      update: {},
    });

    //find or create the item
    const item = await prisma.item.upsert({
      where: {
        name: cur.C_TITLE,
      },
      create: {
        name: cur.C_TITLE,
        categoryId: category.id,
        seedid: cur.SUPPLY_NUM,
        listId: firstList.id,
        quantity:
          findOldQty?.lists[0]?.item?.find((v) => v.seedid === cur.SUPPLY_NUM)
            ?.quantity || 0,
      },
      update: {},
    });

    //find or create store
    const store = await prisma.store.upsert({
      where: {
        name: stores[cur.W_STORE_CODE],
      },
      create: {
        name: stores[cur.W_STORE_CODE],
        number: Number(cur.W_STORE_CODE),
      },
      update: {},
    });

    // find or create user
    const user = await prisma.user.upsert({
      where: {
        email: cur.COMPLETE_ID.toLowerCase() + "@gmail.com",
      },
      create: {
        name: cur.COMPLETE_ID,
        email: cur.COMPLETE_ID.toLowerCase() + "@gmail.com",
      },
      update: {},
    });

    await prisma.order.create({
      data: {
        itemId: item.id,

        storeId: store.id,

        userId: user.id,
        listId: firstList.id,
        quantity: Number(cur.QTY),
        completedAt: new Date(cur.COMPLETE_DATE),
      },
    });

    console.log(Number(item.historyQTY) + Number(cur.QTY));

    await prisma.item.update({
      where: {
        name: cur.C_TITLE,
      },
      data: {
        historyQTY: Number(item.historyQTY) + Number(cur.QTY),
      },
    });
  }
};

const seed = async () => {
  findqty();
};

try {
  seed();
} catch (error) {
  console.log(error);
  process.exitCode = 1;
} finally {
  console.log("db connection closed");
}
