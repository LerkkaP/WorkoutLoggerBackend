const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Workout = require("../models/Workout");
const User = require("../models/User");
const workouts = require("../data");

const newUser = {
  username: "admin",
  hash_password: "Adminpassword23!",
};

beforeEach(async () => {
  await Workout.deleteMany({});
  let workoutObject = new Workout(workouts[0]);
  await workoutObject.save();
  workoutObject = new Workout(workouts[1]);
  await workoutObject.save();

  await User.deleteMany({});
  let userObject = new User(newUser);
  await userObject.save();
});

describe("Workouts API", () => {
  describe("GET /", () => {
    test("should return type json", async () => {
      await request(app)
        .get("/workouts")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("should return all workouts", async () => {
      const res = await request(app).get("/workouts");

      expect(res.body).toHaveLength(workouts.length);
    });
  });

  describe("GET /:id", () => {
    test("should return a specific workout", async () => {
      const workoutResponse = await request(app).get("/workouts");
      const id = workoutResponse.body[0].id;

      const response = await request(app).get(`/workouts/${id}`).expect(200);

      expect(response.body.date).toBe("28/8/2023");
      expect(response.body.id).toBe(id);
    });
  });

  describe("POST /", () => {
    test("should create a workout", async () => {
      const user = await request(app).get("/auth");
      const userId = user.body.map((user) => user.id);

      const res = await request(app)
        .post("/workouts")
        .send({
          date: "18/9/2023",
          userId: userId[0],
          exercises: [{ name: "Weighted lunge", sets: [{ reps: 30, kg: 20 }] }],
        });
      expect(res.statusCode).toBe(201);

      const createdWorkout = await Workout.findById(res.body._id);
      expect(createdWorkout).toBeDefined();

      const updatedWorkouts = await Workout.find({});
      expect(updatedWorkouts.length).toBe(workouts.length + 1);
    });
  });

  describe("DELETE /:id", () => {
    test("should delete a specific workout", async () => {
      const user = await request(app).get("/auth");
      const userId = user.body.map((user) => user.id);

      const newWorkout = await request(app)
        .post("/workouts")
        .send({
          date: "18/9/2023",
          userId: userId[0],
          exercises: [{ name: "Weighted lunge", sets: [{ reps: 30, kg: 20 }] }],
        });

      const res = await request(app).delete(`/workouts/${newWorkout.body.id}`);

      expect(res.statusCode).toBe(204);

      const deletedWorkout = await Workout.findById(newWorkout.body.id);
      expect(deletedWorkout).toBeNull();
    });
  });
});

describe("Exercises API", () => {
  describe("POST /:id/exercises", () => {
    test("should add an exercise to a workout", async () => {
      const user = await request(app).get("/auth");
      const userId = user.body.map((user) => user.id);

      const workoutRes = await request(app).post("/workouts").send({
        date: "18/9/2023",
        userId: userId[0],
        exercises: [],
      });
      const workoutId = workoutRes.body.id;

      const exerciseData = {
        name: "Squat",
        sets: [
          { reps: 5, kg: 50 },
          { reps: 5, kg: 50 },
          { reps: 5, kg: 50 },
        ],
      };
      const response = await request(app)
        .post(`/workouts/${workoutId}/exercises`)
        .send(exerciseData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");

      const updatedWorkout = await Workout.findById(workoutId);

      const initialExerciseCount = workoutRes.body.exercises.length;
      const finalExerciseCount = updatedWorkout.exercises.length;

      expect(finalExerciseCount).toBe(initialExerciseCount + 1);
    });
  });

  describe("PUT /:workout_id/exercises/:exercise_id/sets", () => {
    test("should add a set to a specific exercise", async () => {
      const workoutResponse = await request(app).get("/workouts");
      const workout_id = workoutResponse.body[0].id;
      const exercise_id = workoutResponse.body[0].exercises[0].id;

      const setObject = {
        reps: 10,
        load: 80,
      };

      const response = await request(app)
        .put(`/workouts/${workout_id}/exercises/${exercise_id}/sets`)
        .send(setObject)
        .expect(200);

      expect(response.body.exercises[0].sets).toHaveLength(4);
      expect(response.body.exercises[0].sets[3].reps).toBe(10);
      expect(response.body.exercises[0].sets[3].kg).toBe(80);
    });
  });

  describe("DELETE /:workout_id/exercises/:exercise_id", () => {
    describe("case with multiple exercises", () => {
      test("should delete an exercise from a workout", async () => {
        const workoutResponse = await request(app).get("/workouts");
        const workout_id = workoutResponse.body[0].id;
        const exercise_id = workoutResponse.body[0].exercises[0].id;

        await request(app)
          .delete(`/workouts/${workout_id}/exercises/${exercise_id}`)
          .expect(204);

        const updatedWorkoutResponse = await request(app).get(
          `/workouts/${workout_id}`
        );

        const updatedWorkout = updatedWorkoutResponse.body.exercises.find(
          (exercise) => exercise.id === exercise_id
        );

        expect(updatedWorkout).toBeUndefined();
        expect(updatedWorkoutResponse.body.exercises.length).toBe(2);
      });
    });

    describe("case with an only one exercise", () => {
      test("should delete the entire workout", async () => {
        const workoutResponse = await request(app).get("/workouts");

        const workout_id = workoutResponse.body[0].id;
        const exercise1_id = workoutResponse.body[0].exercises[0].id;
        const exercise2_id = workoutResponse.body[0].exercises[1].id;
        const exercise3_id = workoutResponse.body[0].exercises[2].id;

        await request(app)
          .delete(`/workouts/${workout_id}/exercises/${exercise1_id}`)
          .expect(204);

        await request(app)
          .delete(`/workouts/${workout_id}/exercises/${exercise2_id}`)
          .expect(204);

        await request(app)
          .delete(`/workouts/${workout_id}/exercises/${exercise3_id}`)
          .expect(204);

        const updatedWorkoutResponse = await request(app).get(`/workouts`);
        const deletedWorkout = updatedWorkoutResponse.body.find(
          (w) => w.id == workout_id
        );

        expect(updatedWorkoutResponse.body.length).toBe(1);
        expect(deletedWorkout).toBeUndefined();
      });
    });
  });

  describe("DELETE /:workout_id/exercises/:exercise_id/sets/:set_id", () => {
    test("should delete a set from an exercise", async () => {
      const workoutResponse = await request(app).get("/workouts");
      const workout_id = workoutResponse.body[0].id;
      const exercise_id = workoutResponse.body[0].exercises[0].id;
      const set_id = workoutResponse.body[0].exercises[0].sets[0].id;

      await request(app)
        .delete(
          `/workouts/${workout_id}/exercises/${exercise_id}/sets/${set_id}`
        )
        .expect(204);

      const updatedWorkoutResponse = await request(app).get(
        `/workouts/${workout_id}`
      );
      const updatedExercise = updatedWorkoutResponse.body.exercises.find(
        (exercise) => exercise.id === exercise_id
      );

      const deletedSet = updatedExercise.sets.find((set) => set.id === set_id);

      expect(deletedSet).toBeUndefined();
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
