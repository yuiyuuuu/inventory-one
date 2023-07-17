//used once to reseed inventoryone on heroku because the stores didnt have the seed#
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { c } = require("../server/jsonobj");

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

const seed = async () => {
  //find or create store

  await prisma.store.deleteMany();
  for (let i = 0; i < c.length; i++) {
    const cur = c[i];

    const store = await prisma.store.upsert({
      where: {
        name: stores[cur.W_STORE_CODE],
      },
      create: {
        name: stores[cur.W_STORE_CODE],
        number: Number(cur.W_STORE_CODE),
      },
      update: {
        number: Number(cur.W_STORE_CODE),
        name: stores[cur.W_STORE_CODE],
      },
    });
  }
};

seed().then(() => {
  console.log("stores reseeded");
});
