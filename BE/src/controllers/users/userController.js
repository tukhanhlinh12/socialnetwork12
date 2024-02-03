const { User } = require("../../models/user");
const { Token } = require("../../models/token");
const { createJwtToken } = require("../../util/auth");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const SendEmail = require("../../util/sendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// register - dang ki
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(403)
      .json({ msg: "Invalid input, please check your data" });
  }
  console.log(req.body);
  const { fullName, email, userName, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.errors(err.message);
    res.status(500).send({ msg: "Server Error" });
  }
  if (user) {
    return res.status(200).json({
      status: "fail",
      msg: "User already exists, please login instead.",
    });
  }

  let userNameExists;
  try {
    userNameExists = await User.findOne({ userName });
  } catch (err) {
    console.errors(err.message);
    res.status(500).send({ msg: "Server Error" });
  }
  if (userNameExists) {
    return res.status(200).json({
      status: "fail",
      msg: "Username already exists, please choose another.",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); // ma hoa mat khau
  } catch (err) {
    console.errors(err.message);
    res.status(500).send({ msg: "Server Error" });
  }

  user = new User({
    fullName,
    email,
    userName,
    password: hashedPassword,
  });
  try {
    await user.save().then((doc) => {
      const token = createJwtToken(doc._id);
      res.json({ status: "true", msg: "Register Successfully", token: token });
    });
  } catch (err) {
    console.log(err);
  }
};

// login - dang nhap
exports.login = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      const { email, password } = req.body;

      const staff = await User.findOne({ email: email });

      if (!staff) {
        return res.json({ status: "fail", msg: "Email not found" });
      }

      const passwordMatch = await bcrypt.compare(password, staff.password);
      if (!passwordMatch) {
        return res.json({ status: "fail", msg: "Password does not match!" });
      }

      const token = createJwtToken(staff._id);
      return res.json({
        status: "success",
        msg: "Login successful",
        token: token,
        data: staff,
      });
    } else {
      const token = req.headers.authorization.split(" ")[1];

      if (token) {
        jwt.verify(
          token,
          process.env.JWT_SECRET_KEY,
          async (err, decodedToken) => {
            if (err) {
              return res.json({ status: "fail", msg: "Invalid token" });
            }
            try {
              const doc = await User.findOne({ _id: decodedToken.userID });

              if (!doc) {
                return res.json({ status: "fail", msg: "User not found" });
              }

              req.userId = decodedToken.userID;
              req.user = doc;
              next();
            } catch (err) {
              return res.json({ status: "fail", msg: "Server error" });
            }
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "fail", msg: "Internal server error" });
  }
};

// forget password - quen mat khau
exports.forgetPass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(200)
      .json({ msg: "Invalid input, please check your data" });
  }
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user)
    return res.status(200).json({ status: "fail", msg: "Email not found" });
  const n = crypto.randomInt(100000, 999999);
  console.log(n);
  const newpass = await bcrypt.hash(n.toString(), 12);
  await SendEmail(
    user.email,
    "Hello User",
    `${n}, Link: https://travelling-social-media-fe.vercel.app/changepass/${user._id}`
  );
  await User.findOneAndUpdate(
    { email: user.email },
    { password: newpass },
    { new: true }
  ).then((doc) => {
    res.json({ status: true, msg: "Check your email to receive new code" });
  });
};

// change password - thay doi mat khau
exports.userChangePass = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.json({ status: "fail", msg: "user not found!" });
    }

    const { oldPassword, newPassword } = req.body;

    if (oldPassword && newPassword) {
      const check = await bcrypt.compare(oldPassword, user.password);

      if (!check) {
        return res.json({ status: "fail", msg: "Old password is not match" });
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await User.findOneAndUpdate(
          { _id: userID },
          { password: hashedPassword },
          { new: true }
        );

        return res.json({
          status: "success",
          msg: "password has changed",
          info: updatedUser,
        });
      }
    }
    console.log("user");
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: "fail", msg: "Server Error" });
  }
};
