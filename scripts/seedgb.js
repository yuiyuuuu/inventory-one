const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const stores = [
  { number: 8001, name: "8001-GB-HQ" },
  { number: 8002, name: "8002-GB-LINCOLNWOOD" },
  { number: 8003, name: "8003-GB-JEFFERSON-PARK" },
  { number: 8004, name: "8004-GB-SCHAUMBURG" },
];

async function f() {
  for (let i = 0; i < stores.length; i++) {
    const cur = stores[i];

    await prisma.store.create({
      data: {
        name: cur.name,
        number: cur.number,
      },
    });
  }
}

f().then(() => {
  console.log("db connection closed");
});
