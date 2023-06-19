const router = require("express").Router();

module.exports = router;

//all api routes
router.use("/item", require("./item.js"));
router.use("/stores", require("./stores.js"));
