const jwt = require("jsonwebtoken");

exports.createJwtToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};
