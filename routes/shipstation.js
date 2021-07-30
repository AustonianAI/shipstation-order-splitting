const express = require("express");

const shipstationController = require("../controllers/shipstation");

const router = express.Router();

router.get("/test", shipstationController.test);

router.post("/new-order-webhook", shipstationController.newOrder);

module.exports = router;
