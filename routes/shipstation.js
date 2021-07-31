const express = require("express");

const shipstationController = require("../controllers/shipstation");

const router = express.Router();

// Route to receive the ShipStation New Order Webhook
router.post("/new-order-webhook", shipstationController.newOrders);

module.exports = router;
