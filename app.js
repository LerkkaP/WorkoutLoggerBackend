const express = require("express");
const config = require("./utils/config");
const mongoose = require("mongoose");
const workout_routes = require("./routes/workouts");
var cors = require("cors");

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use("/workouts", workout_routes);

module.exports = app;
