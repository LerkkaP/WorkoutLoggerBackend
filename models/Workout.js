const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  exercises: [
    {
      name: {
        type: String,
        required: true,
      },
      sets: [
        {
          reps: {
            type: Number,
            min: 0,
            required: true,
          },
          kg: Number,
        },
      ],
    },
  ],
});

workoutSchema.methods.toJSON = function () {
  const workout = this.toObject();
  workout.id = workout._id.toString();
  delete workout._id;
  delete workout.__v;

  workout.exercises.forEach((exercise) => {
    exercise.id = exercise._id.toString();
    delete exercise._id;
  });

  workout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      set.id = set._id.toString();
      delete set._id;
    });
  });

  return workout;
};

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
