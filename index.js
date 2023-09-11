const express = require("express");
const workout_routes = require("./routes/workouts");
var cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/workouts", workout_routes);

require("dotenv").config();

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
