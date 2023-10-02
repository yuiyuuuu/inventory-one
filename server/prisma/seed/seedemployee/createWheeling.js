const prisma = require("../../prismaClient");

async function f() {
  await prisma.store.create({
    data: {
      name: "7000-CITYWEB",
      number: 7000,
    },
  });
}

f().then(() => {
  console.log("db connection closed");
});
