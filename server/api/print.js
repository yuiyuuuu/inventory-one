const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const aws = require("aws-sdk");
const s3 = new aws.S3();

const busboy = require("busboy");

module.exports = router;

router.get("/fetch/:id/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const find = await prisma.print.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        printFiles: true,
      },
    });

    if (!find?.id) {
      res.send("not found");
      return;
    }

    res.send(find);
  } catch (error) {
    next(error);
  }
});

router.post("/createlist/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const find = await prisma.print.findUnique({
      where: {
        name: req.body.name,
      },
    });

    if (find?.id) {
      res.send("already exists");
      return;
    }

    const create = await prisma.print.create({
      data: {
        name: req.body.name,
        userid: req.body.userid,
      },
    });

    res.send(create);
  } catch (error) {
    next(error);
  }
});

router.put("/uploads3/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    const body = req.body;

    await s3
      .putObject({
        Body: Buffer.from(
          body.buffer.replace(/^data:application\/\w+;base64,/, ""),
          "base64"
        ),
        Bucket: "inventoryone",
        Key: `${req.body.printlist?.name}/${body?.name}`,
      })
      .promise();

    //upsert because if filename is the same, then s3 above will override it. pathname will remain the same if it already exists.
    await prisma.printFile.upsert({
      where: {
        pathName: `${req.body.printlist?.name}/${body?.name}`,
      },
      create: {
        pathName: `${req.body.printlist?.name}/${body?.name}`,
        printListId: req.body.printlist.id,
      },
      update: {},
    });

    res.send("uploaded").status(200);
  } catch (error) {
    next(error);
  }
});

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
