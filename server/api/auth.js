const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const obj = req.body;
    //finish later, need to be able to signup first
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, password, email } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser?.id) {
      res.send("email-exists").status(401);
      return;
    }

    const encrypt = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        password: encrypt,
        email: email,
      },

      include: {
        lists: true,
        sharedLists: true,
        orders: true,
      },
    });

    res.send({ user, jwt: jwt.sign(user.id, process.env.JWT) });
  } catch (error) {
    next(error);
  }
});

router.get("/getlocaldata/:token", async (req, res, next) => {
  try {
    const id = await jwt.verify(req.params.token, process.env.JWT);

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },

      include: {
        lists: true,
        sharedLists: true,
        orders: true,
      },
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
});
