const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const aws = require("aws-sdk");
const s3 = new aws.S3();

module.exports = router;

router.put("/uploadpdf", async (req, res, next) => {
  try {
    const upload = await s3
      .putObject({
        Body: "hello world",
        Bucket: "inventoryone",
        Key: "myfirstlist/firstone.pdf",
      })
      .promise();

    console.log(upload);

    res.send("uploaded").status(200);
  } catch (error) {
    next(error);
  }
});
