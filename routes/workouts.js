const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");

router.get("/", workoutController.getWorkouts);
router.get("/:id", workoutController.getWorkoutById);
router.post("/", workoutController.createWorkout);
router.delete("/:id", workoutController.deleteWorkout);
router.post("/:id/exercises", workoutController.addExerciseToWorkout);
router.put(
  "/:workout_id/exercises/:exercise_id/sets",
  workoutController.addSetToExercise
);
router.delete(
  "/:workout_id/exercises/:exercise_id",
  workoutController.deleteExerciseFromWorkout
);
router.delete(
  "/:workout_id/exercises/:exercise_id/sets/:set_id",
  workoutController.deleteSetFromExercise
);

module.exports = router;
