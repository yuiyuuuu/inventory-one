const prisma = require("../prismaClient");

const { c } = require("../../jsonobj");

const bcrypt = require("bcrypt");

//IMPORTANT
//for later on when you recount inventory, before deleting everything, store the previous qty here and then we can reseed with the previous qty.
// that way we get the new updates and dont have to recount inventory
//will applythis when i recount inventory since I havent updated in so long

//this file does not preserve old qty

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
  await prisma.item.deleteMany();
  await prisma.order.deleteMany();
  await prisma.category.deleteMany();
  await prisma.list.deleteMany();

  const jack = await prisma.user.upsert({
    where: {
      email: "hr@palmusa.com",
    },
    create: {
      name: "HR @ Palm",
      email: "hr@palmusa.com",
      password: await bcrypt.hash("hrpalm5050", 10),
    },

    update: {},
  });

  await prisma.user.upsert({
    where: {
      email: "retail@palmusa.com",
    },
    create: {
      name: "Retail @ Palm",
      email: "retail@palmusa.com",
      password: await bcrypt.hash("retailpalm5050", 10),
    },
    update: {},
  });

  await prisma.user.upsert({
    where: {
      email: "test@palmusa.com",
    },
    create: {
      name: "Test @ Palm",
      email: "test@palmusa.com",
      password: await bcrypt.hash("testpalm5050", 10),
    },
    update: {},
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
        quantity: 0,
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
