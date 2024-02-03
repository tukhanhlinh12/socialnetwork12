const { string } = require("joi");
const mongoose = require("mongoose");

const basicInfo = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  cover: {type: String},
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { type: String },
  vacations: {
    inProgess: [{type: String}],
    finished: [{type: String}],
    intention: [{type: String}],
  }


});

const User = mongoose.model("Users", basicInfo);
module.exports = { User };
