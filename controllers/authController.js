const User = require("../models/User");
const jwt = require("jsonwebtoken");
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

const signIn = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.hash_password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  console.log(process.env.SECRET);

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).json({ token, username: user.username });
};

module.exports = { signUp, signIn, getUsers };
