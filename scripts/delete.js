const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function deleteAll() {
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
  await prisma.order.deleteMany();
  await prisma.store.deleteMany();
  await prisma.category.deleteMany();
  await prisma.keylog.deleteMany();
  await prisma.list.deleteMany();
}

deleteAll()
  .then(() => console.log("all deleted"))
  .catch(() => console.log("something went wrong"));
