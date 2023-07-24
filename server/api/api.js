const router = require("express").Router();

module.exports = router;

//all api routes
router.use("/item", require("./item.js"));
router.use("/stores", require("./stores.js"));
router.use("/keys", require("./keyLog.js"));
router.use("/auth", require("./auth.js"));
router.use("/list", require("./list.js"));
router.use("/qr", require("./qr.js"));
router.use("/print", require("./print.js"));
