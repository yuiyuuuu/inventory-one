const router = require("express").Router();
const prisma = require("../prisma/prismaClient.js");

const aws = require("aws-sdk");
const s3 = new aws.S3({ region: process.env.AWS_DEFAULT_REGION });

const fs = require("fs");

const pd = require("pdfjs-dist");

module.exports = router;

router.get("/gets3/:printlist/:pathname/:secretkey", async (req, res, next) => {
  if (req.params.secretkey !== process.env.ROUTEPASS) {
    res.send("access denied").status(401);
    return;
  }

  try {
    let result = null;

    const data = await s3
      .getObject(
        {
          Bucket: "inventoryone",
          Key: req.params.printlist + "/" + req.params.pathname,
        }
        // async function (error, data) {
        //   if (error) {
        //     result = "error";
        //   } else {
        //     // constfs.writeFile(
        //     //   req.params.pathname,
        //     //   Buffer.from(data.Body.data),
        //     //   function (error) {
        //     //     if (error) {
        //     //       console.log(error);
        //     //     }
        //     //   }
        //     // );

        //     // console.log(req.params.pathname);
        //     // const pdf = await pd.getDocument({
        //     //   data: new Int8Array(data.Body).buffer,
        //     // });

        //     // console.log(data.Body.toString(), "bufffferrrr");

        //     // const str = btoa(
        //     //   new Uint8Array(data.Body).reduce(
        //     //     (data, byte) => data + String.fromCharCode(byte),
        //     //     ""
        //     //   )
        //     // );

        //     // console.log(new Uint8Array(data.Body));

        //     /**.reduce(
        //         (data, byte) => data + String.fromCharCode(byte),
        //         ""
        //       )*/
        //     // console.log(str);
        //     // console.log(data);

        //     // result = str;

        //     result = btoa(data.Body.toString("base64"));
        //   }
        // }
      )
      .promise();

    result = btoa(data.Body.toString("base64"));

    res.setHeader(
      "Content-disposition",
      "attachment;filename=" + req.params.pathname
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
});

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

router.delete(
  "/deletelist/:id/:printlist/:secretkey",
  async (req, res, next) => {
    if (req.params.secretkey !== process.env.ROUTEPASS) {
      res.send("access denied").status(401);
      return;
    }
    try {
      await prisma.print.delete({
        where: {
          id: req.params.id,
        },
      });

      //delete objects from aws
      const listedObjects = await s3
        .listObjectsV2({
          Bucket: "inventoryone",
          Prefix: req.params.printlist + "/",
        })
        .promise();

      if (listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: "inventoryone",
          Delete: { Objects: [] },
        };
        listedObjects.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });

        await s3.deleteObjects(deleteParams).promise();
      }

      res.send("deleted");
    } catch (error) {
      next(error);
    }
  }
);
