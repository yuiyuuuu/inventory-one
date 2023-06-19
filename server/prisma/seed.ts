const prisma = require("./prismaClient");

const { c } = require("../jsonobj");

const stores = {
  1: "MAIN H/Q",
  2: "COM-2",
  3: "MAD-1",
  4: "MAD-2",
  5: "MILWAUKEE",
  7: "47TH-E",
  8: "HARVEY",
  9: "WILSON",
  11: "111TH",
  12: "HS-47",
  13: "65TH",
  14: "CHICAGO",
  15: "63RD",
  16: "71ST",
  17: "GARY",
  18: "NORTH",
  21: "87TH",
  22: "COM-2",
  26: "BLACKROSE",
  27: "JOLIET",
  28: "113TH",
  30: "116TH",
  31: "BOLINGBROOK",
  32: "OMEGA",
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

  for (let i = 0; i < c.length; i++) {
    const cur = c[i];

    // //find pr create the item
    const item = await prisma.item.upsert({
      where: {
        name: cur.C_TITLE,
      },
      create: {
        name: cur.C_TITLE,
      },
      update: {},
    });

    console.log(stores[cur.W_STORE_CODE], cur.W_STORE_CODE);

    //find or create store
    const store = await prisma.store.upsert({
      where: {
        name: stores[cur.W_STORE_CODE],
      },
      create: {
        name: stores[cur.W_STORE_CODE],
      },
      update: {},
    });

    // find or create user
    const user = await prisma.user.upsert({
      where: {
        name: cur.COMPLETE_ID,
      },
      create: {
        name: cur.COMPLETE_ID,
      },
      update: {},
    });

    await prisma.order.create({
      data: {
        itemId: item.id,

        storeId: store.id,

        userId: user.id,
        quantity: cur.QTY,
        completedAt: cur.COMPLETE_DATE,
      },
    });

    await prisma.item.update({
      where: {
        name: cur.C_TITLE,
      },
      data: {
        historyQTY: item.historyQTY + cur.QTY,
      },
    });
  }
};

const seed = async () => {
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();
  await prisma.order.deleteMany();
  await prisma.yesterday.deleteMany();

  findqty();

  // const re = Object.values(findqty());

  // for (let i = 0; i < re.length; i++) {
  //   const cur = re[i];

  //   // const store = await prisma.store.findUnique({
  //   //   where:{
  //   //     name:stores[]
  //   //   }
  //   // })

  //   // await prisma.item.create({
  //   //   data: {
  //   //     name: cur.name,
  //   //     quantity: 0,
  //   //     historyQTY: cur.quantity,
  //   //     completedTimes: cur.completedDates,
  //   //   },
  //   // });
  // }
};

try {
  seed();
} catch (error) {
  console.log(error);
  process.exitCode = 1;
} finally {
  console.log("db connection closed");
}
