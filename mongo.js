require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

const workout = new Workout({
  date: "12/12/2023",
  exercises: [
    {
      name: "Bench press",
      sets: [
        {
          reps: "5",
          kg: "5",
        },
      ],
    },
  ],
});

workout.save().then((result) => {
  console.log("Workout saved");
  mongoose.connection.close();
});
