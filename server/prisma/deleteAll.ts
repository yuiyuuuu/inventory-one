const prisma = require("./prismaClient");

async function del() {
  try {
    await prisma.item.deleteMany();
    await prisma.yesterday.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();

    console.log("deleted");
  } catch (error) {
    console.log(error);
  }
}

del();
