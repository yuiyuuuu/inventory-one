const prisma = require("../../prismaClient");

const { store: storeIncludes } = require("../../../api/includes");

const axios = require("axios");

async function f() {
  await prisma.employees.deleteMany();

  const { data } = await axios.get(process.env.SEEDLINK);

  const stores = await prisma.store.findMany();

  for (let i = 0; i < data.length; i++) {
    const cur = data[i];
    await prisma.employees.create({
      data: {
        firstName: cur["First name"],
        lastName: cur["Last name"],
        intranetId: cur.ID,
        store: {
          connect: {
            id: stores.find((v) => v.number === Number(cur.STORE_CODE))?.id,
          },
        },
        phone: cur?.["Phone No."] ? String(cur?.["Phone No."]) : null,
        address: cur?.Address || null,
        email: cur?.MEM_EMAIL || null,
        role: cur.USER_CLASS_NAME.replace(/ *\([^)]*\) */g, "").trim(),
        startDate: new Date(
          Math.round((cur?.["START DATE"] - 25569) * 86400 * 1000)
        ).toISOString(),
      },
    });
  }
}

f().then(() => {
  console.log("db connection closed");
});
