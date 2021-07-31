const express = require("express");

const shipstationController = require("../controllers/shipstation");

const router = express.Router();

router.get("/test", shipstationController.newOrders);

router.post("/new-order-webhook", shipstationController.newOrders);

module.exports = router;
