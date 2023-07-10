const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function z() {
  await prisma.qR.deleteMany();
}

z().then(() => {
  console.log("deleted qrs");
});
