const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const parser = require("body-parser");
const port = process.env.PORT || 3004;

const cron = require("node-cron");
const cors = require("cors");

const prisma = require("./prisma/prismaClient");

app.use(express.static(path.join(__dirname, "..", "dist")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use(morgan("dev"));

app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded());

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use("/api", require("./api/api"));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist/index.html"));
});

// app.listen(port, () => console.log("listening on port " + port));

const http = require("http");

app.set("port", process.env.PORT || 3004);
app.set("host", process.env.HOST || "0.0.0.0");

// http
//   .createServer(app)
app.listen(
  app.get("port"),
  // app.get("host"),
  console.log("listening on port " + app.get("host") + app.get("port"))
);
