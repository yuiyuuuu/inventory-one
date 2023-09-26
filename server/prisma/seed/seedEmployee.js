const prisma = require("../prismaClient");

const { store: storeIncludes } = require("../../api/includes");

const employees = [
  {
    firstName: "James",
    lastName: "Lin",
    email: "jameslin6@gmail.com",
    role: "Sales Associate",
    // store: "",
    startDate: new Date().toISOString(),
  },

  {
    firstName: "Nora",
    lastName: "Gabb",
    email: "noragabb5@gmail.com",
    role: "Manager",
    // store: "63rd",
    startDate: new Date().toISOString(),
  },

  {
    firstName: "Nora",
    lastName: "Gabb",
    email: "noragabb4@gmail.com",
    role: "Manager",
    // store: "63rd",
    startDate: new Date().toISOString(),
  },

  {
    firstName: "Nora",
    lastName: "Gabb",
    email: "noragabb3@gmail.com",
    role: "Manager",
    // store: "63rd",
    startDate: new Date().toISOString(),
  },

  {
    firstName: "Nora",
    lastName: "Gabb",
    email: "noragabb2@gmail.com",
    role: "Manager",
    // store: "63rd",
    startDate: new Date().toISOString(),
  },

  {
    firstName: "Nora",
    lastName: "Gabb",
    email: "noragabb1@gmail.com",
    role: "Manager",
    // store: "63rd",
    startDate: new Date().toISOString(),
  },
];

async function f() {
  await prisma.employees.deleteMany();

  const stores = await prisma.store.findMany({
    include: JSON.parse(storeIncludes),
  });

  for (let i = 0; i < Object.keys(employees).length; i++) {
    const cur = employees[i];

    await prisma.employees.create({
      data: {
        firstName: cur.firstName,
        lastName: cur.lastName,
        email: cur.email,
        role: cur.role,
        startDate: cur.startDate,
        storeId: stores[Math.floor(Math.random() * 10)].id, //random store
      },
    });
  }
}

f().then(() => {
  console.log("db connection closed");
});
