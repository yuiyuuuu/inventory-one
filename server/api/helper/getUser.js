const prisma = require("../../prisma/prismaClient.js");

const jwt = require("jsonwebtoken");

async function getUser(auth) {
  if (!auth) {
    return null;
  }

  const id = await jwt.verify(auth, process.env.JWT);

  const user = await prisma.user.findUnique({
    where: {
      id: id?.iat ? id.id : id,
    },
  });

  return user;
}

module.exports = { getUser };
