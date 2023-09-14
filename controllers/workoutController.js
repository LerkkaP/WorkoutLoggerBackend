//const workouts = require("../data");//
const Workout = require("../models/Workout");

// get all workouts
const getWorkouts = (req, res) => {
  Workout.find({}).then((workout) => res.json(workout));
};

// get a specific workout
const getWorkoutById = async (req, res) => {
  const id = req.params.id;

  try {
    const workout = await Workout.findById(id);
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add a new workout
const createWorkout = async (req, res) => {
  const workout = req.body;

  const newWorkout = new Workout(workout);

  try {
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a specific workout
const deleteWorkout = async (req, res) => {
  try {
    const id = req.params.id;
    await Workout.deleteOne({
      _id: id,
    });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add a new exercise to a specific workout
const addExerciseToWorkout = async (req, res) => {
  try {
    const id = req.params.id;
    const exerciseObject = req.body;
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id },
      { $push: { exercises: exerciseObject } },
      { new: true }
    );

    res.status(201).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add a new set to a specific exercise inside a specific workout
const addSetToExercise = async (req, res) => {
  try {
    const workout_id = req.params.workout_id;
    const exercise_id = req.params.exercise_id;
    const { reps, load } = req.body;

    const updatedExercise = await Workout.findOneAndUpdate(
      { _id: workout_id, "exercises._id": exercise_id },
      { $push: { "exercises.$.sets": { reps, kg: load } } },
      { new: true }
    );

    res.status(200).json(updatedExercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a specific exercise inside a specific workout
const deleteExerciseFromWorkout = async (req, res) => {
  try {
    const workout_id = req.params.workout_id;
    const exercise_id = req.params.exercise_id;
    const workout = await Workout.findById(workout_id);
    if (workout.exercises.length === 1) {
      await Workout.deleteOne({
        _id: workout_id,
      });
      res.status(202).json();
    } else {
      const updatedWorkout = await Workout.findOneAndUpdate(
        { _id: workout_id },
        { $pull: { exercises: { _id: exercise_id } } },
        { new: true }
      );
      res.status(204).json(updatedWorkout);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a specific set inside a specific exercise
const deleteSetFromExercise = (req, res) => {
  const workout_id = Number(req.params.workout_id);
  const exercise_id = req.params.exercise_id;
  const set_id = req.params.set_id;

  const workout = workouts.find((workout) => workout.id === workout_id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  const exercise = workout.exercises.find((e) => e.exercise_id === exercise_id);

  if (!exercise) {
    return res.status(404).json({ error: "Exercise not found" });
  }

  exercise.sets = exercise.sets.filter((set) => set.set_id !== set_id);

  res.status(204).end();
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  addSetToExercise,
  deleteExerciseFromWorkout,
  deleteSetFromExercise,
};
