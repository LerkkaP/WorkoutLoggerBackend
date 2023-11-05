const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

const validatePassword = (password1, password2) => {
  if (password1 !== password2) {
    return "Passwords don't match";
  } else if (!passwordRegex.test(password1)) {
    return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit and one special character";
  }

  return null;
};

module.exports = { validatePassword };
