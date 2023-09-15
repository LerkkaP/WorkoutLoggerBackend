const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Workout = require("../models/Workout");
const workouts = require("../data");

beforeEach(async () => {
  await Workout.deleteMany({});
  let workoutObject = new Workout(workouts[0]);
  await workoutObject.save();
  workoutObject = new Workout(workouts[1]);
  await workoutObject.save();
});

describe("GET /workouts", () => {
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

afterAll(async () => {
  await mongoose.connection.close();
});
