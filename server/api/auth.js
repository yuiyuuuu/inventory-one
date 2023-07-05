const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const obj = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },

      include: {
        lists: true,
        sharedLists: true,
        orders: true,
      },
    });

    if (!findUser?.id) {
      res.send("notfound").status(401);
      return;
    }

    try {
      const compare = await bcrypt.compare(
        req.body.password,
        findUser.password
      );

      if (compare) {
        res
          .send({
            user: findUser,
            jwt: jwt.sign({ id: findUser.id }, process.env.JWT),
          })
          .status(200);
      } else {
        res.send("wrongpassword").status(401);
      }
    } catch (error) {
      next(error);
    }
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
        id: id?.iat ? id.id : id,
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
