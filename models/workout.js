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

module.exports = mongoose.model("Workout", workoutSchema);
