// add a new exercise to a specific workout
app.post("/workouts/:id/exercises", (req, res) => {
  const id = Number(req.params.id);
  const exerciseObject = req.body;

  const workout = workouts.find((workout) => workout.id === id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  workout.exercises.push(exerciseObject);

  res.json(workout);
});

// add a new set to a specific exercise inside a specific workout
app.put("/workouts/:workout_id/exercises/:exercise_id/sets", (req, res) => {
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
  console.log(json(workout));
});

// delete a specific exercise inside a specific workout
app.delete("/workouts/:workout_id/exercises/:exercise_id", (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// delete a specific set inside a specific exercise
app.delete(
  "/workouts/:workout_id/exercises/:exercise_id/sets/:set_id",
  (req, res) => {
    const workout_id = Number(req.params.workout_id);
    const exercise_id = req.params.exercise_id;
    const set_id = req.params.set_id;

    const workout = workouts.find((workout) => workout.id === workout_id);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    const exercise = workout.exercises.find(
      (e) => e.exercise_id === exercise_id
    );

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    exercise.sets = exercise.sets.filter((set) => set.set_id !== set_id);

    res.status(204).end();
  }
);
