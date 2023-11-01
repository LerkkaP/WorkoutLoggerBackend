const express = require("express");
const config = require("./utils/config");
const mongoose = require("mongoose");
const workout_routes = require("./routes/workouts");
const auth_routes = require("./routes/auth");
const morgan = require("morgan");
const helmet = require("helmet");
var cors = require("cors");

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(cors());

app.use("/workouts", workout_routes);
app.use("/auth", auth_routes);

module.exports = app;
