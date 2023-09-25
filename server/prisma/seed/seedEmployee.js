const prisma = require("../prismaClient");

const employees = [
  {
    firstName: "James",
    lastName: "Lin",
    email: "jameslin@gmail.com",
    role: "Sales Associate",
    store: "71st",
    startDate: new Date().toISOString(),
  },

  {
    firstName: "Nora",
    lastName: "Gabb",
    email: "noragabb@gmail.com",
    role: "Manager",
    store: "63rd",
    startDate: new Date().toISOString(),
  },
];

async function f() {
  await prisma.employees.deleteMany();

  for (let i = 0; i < Object.keys(employees).length; i++) {
    const cur = employees[i];

    await prisma.employees.create({
      data: {
        firstName: cur.firstName,
        lastName: cur.lastName,
        email: cur.email,
        role: cur.role,
        startDate: cur.startDate,
      },
    });
  }
}

f().then(() => {
  console.log("db connection closed");
});
