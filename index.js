const express = require("express");
const mongoose = require("mongoose");
const workout_routes = require("./routes/workouts");
var cors = require("cors");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use("/workouts", workout_routes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
