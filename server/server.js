const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const parser = require("body-parser");
const port = process.env.PORT || 3004;

const cron = require("node-cron");

const prisma = require("./prisma/prismaClient");

app.use(express.static(path.join(__dirname, "..", "dist")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use(morgan("dev"));

app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded());

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use("/api", require("./api/api"));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist/index.html"));
});

cron.schedule("* * 0 * * *", async function () {
  console.log("running every day at 1 am");

  const allItems = await prisma.item.findMany({
    include: {
      yesterdayStock: true,
    },
  });

  for (let i = 0; i < allItems.length; i++) {
    const cur = allItems[i];

    if (!cur.yesterdayStock) {
      await prisma.yesterday.create({
        data: {
          stock: 0,
          item: {
            connect: {
              id: cur.id,
            },
          },
        },
      });
    } else {
      const today = new Date();

      const prevStock = await prisma.yesterday.findUnique({
        where: {
          id: cur.yesterdayId,
        },
      });

      console.log(cur.quantity, "qtyyyyyyyyy");
      console.log(prevStock);

      if (cur.quantity < prevStock.stock) {
        console.log("rannnn");
        await prisma.item.update({
          where: {
            id: cur.id,
          },
          data: {
            completedTimes: [
              ...cur.completedTimes,
              {
                completedTime: `${
                  today.getMonth() + 1
                }/${today.getDate()}/${today.getFullYear()}`,
                completedTimeStamp: today.getTime(),
                qty: prevStock.stock - cur.quantity,
                completedBy: "Yingson.Yu",
              },
            ],
          },
        });
      }

      //this should be last.
      await prisma.yesterday.update({
        where: {
          id: cur.yesterdayId,
        },
        data: {
          stock: cur.quantity,
        },
      });
    }
  }
});

app.listen(port, () => console.log("listening on port " + port));
