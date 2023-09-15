const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

describe("GET /workouts", () => {
  test("should return all workouts", async () => {
    await request(app)
      .get("/workouts")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});
