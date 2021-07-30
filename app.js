const path = require("path");

const express = require("express");

const errorController = require("./controllers/error");

const shipStationRoutes = require("./routes/shipstation");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/shipstation/", shipStationRoutes);

app.use(errorController.get404);

app.listen(3000);
