const path = require("path");

const express = require("express");

const shipStationController = require("../controllers/shipstation");

const router = express.Router();

router.get("/test", shipStationController.test);

module.exports = router;
