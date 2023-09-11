const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  date: String,
  exercises: [
    {
      name: String,
      sets: [
        {
          reps: Number,
          kg: Number,
        },
      ],
    },
  ],
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
