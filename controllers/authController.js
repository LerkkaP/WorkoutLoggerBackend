const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validatePassword } = require("../utils/passwordUtils");

const saltRounds = 10;

const getUsers = (req, res) => {
  User.find({}).then((user) => res.json(user));
};

const signUp = async (req, res) => {
  const { username, password1, password2 } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({
      message: "Username is already taken",
    });
  }

  const passwordValidationResult = validatePassword(password1, password2);

  if (passwordValidationResult) {
    return res.status(400).json({ message: passwordValidationResult });
  }

  try {
    const hashedPassword = await bcrypt.hash(password1, saltRounds);

    const newUser = new User({
      username,
      hash_password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signIn = (req, res) => {
  console.log(req.body);
};

module.exports = { signUp, signIn, getUsers };
