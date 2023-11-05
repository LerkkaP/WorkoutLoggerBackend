const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

const newUser = {
  username: "admin",
  hash_password: "Adminpassword23!",
};

beforeEach(async () => {
  await User.deleteMany({});
  let userObject = new User(newUser);
  await userObject.save();
});

describe("AUTH API", () => {
  describe("GET /auth", () => {
    test("should return type json", async () => {
      await request(app)
        .get("/auth")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("should return all users", async () => {
      const res = await request(app).get("/auth");

      expect(res.body).toHaveLength(1);
    });
  });

  describe("POST /auth/signup", () => {
    test("with valid inputs should create an account", async () => {
      const res = await request(app).post("/auth/signup").send({
        username: "test_user",
        password1: "Adminpassword23!",
        password2: "Adminpassword23!",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Account created successfully!");

      const createdUser = await User.findById(res.body._id);
      expect(createdUser).toBeDefined();

      const updatedUsers = await User.find({});
      expect(updatedUsers.length).toBe(2);
    });

    test("should not create an account if username is already taken", async () => {
      const res = await request(app).post("/auth/signup").send({
        username: "admin",
        password1: "Adminpassword23!",
        password2: "Adminpassword23!",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Username is already taken");

      const updatedUsers = await User.find({});
      expect(updatedUsers.length).toBe(1);
    });

    test("should not create an account if passwords don't match", async () => {
      const res = await request(app).post("/auth/signup").send({
        username: "test_user",
        password1: "Adminpassword23!",
        password2: "Adminpassword24!",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Passwords don't match");

      const updatedUsers = await User.find({});
      expect(updatedUsers.length).toBe(1);
    });

    test("should not create an account if password is invalid", async () => {
      const res = await request(app).post("/auth/signup").send({
        username: "test_user",
        password1: "test",
        password2: "test",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit and one special character"
      );

      const updatedUsers = await User.find({});
      expect(updatedUsers.length).toBe(1);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
