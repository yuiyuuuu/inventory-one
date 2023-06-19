const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

module.exports = router;

router.get("/fetchall", async (req, res, next) => {
  try {
    const stores = await prisma.store.findMany();

    res.send(stores);
  } catch (error) {
    next(error);
  }
});
