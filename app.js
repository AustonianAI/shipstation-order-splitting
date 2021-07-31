const express = require("express");

const shipStationRoutes = require("./routes/shipstation");
const compression = require("compression");

const app = express();
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/shipstation/", shipStationRoutes);

app.listen(process.env.PORT || 3000);
