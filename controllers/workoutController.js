const workouts = require("../data");

// get all workouts
const getWorkouts = (req, res) => {
  res.json(workouts);
};

// get a specific workout
const getWorkoutById = (req, res) => {
  const id = req.params.id;
  const workout = workouts.find((workout) => workout.id == id);
  res.json(workout);
};

// add a new workout
const createWorkout = (req, res) => {
  const workout = req.body;
  res.json(workout);
};

// delete a specific workout
const deleteWorkout = (req, res) => {
  const id = Number(req.params.id);
  workouts = workouts.filter((workout) => workout.id !== id);
  res.status(204).end();
};

// add a new exercise to a specific workout
const addExerciseToWorkout = (req, res) => {
  const id = Number(req.params.id);
  const exerciseObject = req.body;

  const workout = workouts.find((workout) => workout.id === id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  workout.exercises.push(exerciseObject);

  res.json(workout);
};

// add a new set to a specific exercise inside a specific workout
const addSetToExercise = (req, res) => {
  const workout_id = Number(req.params.workout_id);
  const exercise_id = req.params.exercise_id;
  const { set_id, reps, load } = req.body;

  const workout = workouts.find((workout) => workout.id === workout_id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  const exercise = workout.exercises.find((e) => e.exercise_id === exercise_id);

  if (!exercise) {
    return res.status(404).json({ error: "Exercise not found" });
  }

  const newSet = {
    set_id,
    reps: parseFloat(reps),
    kg: parseFloat(load),
  };

  exercise.sets.push(newSet);

  res.json(workout);
};

// delete a specific exercise inside a specific workout
const deleteExerciseFromWorkout = (req, res) => {
  const workout_id = Number(req.params.workout_id);
  const exercise_id = req.params.exercise_id;

  const workout = workouts.find((workout) => workout.id === workout_id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  workout.exercises = workout.exercises.filter(
    (exercise) => exercise.exercise_id !== exercise_id
  );

  res.status(204).end();
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
