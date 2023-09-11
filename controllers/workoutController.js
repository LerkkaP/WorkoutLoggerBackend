// get all workouts
app.get("/workouts", (req, res) => {
  res.json(workouts);
});

// get a specific workout
app.get("/workouts/:id", (req, res) => {
  const id = req.params["id"];
  const workout = workouts.find((workout) => workout.id == id);
  res.json(workout);
});

// add a new workout
app.post("/workouts", (req, res) => {
  const workout = req.body;
  res.json(workout);
});

// delete a specific workout
app.delete("/workouts/:id", (req, res) => {
  const id = Number(req.params.id);
  workouts = workouts.filter((workout) => workout.id !== id);
  res.status(204).end();
});
