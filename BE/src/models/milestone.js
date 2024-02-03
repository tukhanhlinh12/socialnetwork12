const mongoose = require("mongoose");

const milestoneModel = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    time: {type: Date},
    desc: {type: String},
    vacation: {
      type: mongoose.Types.ObjectId,
      ref: "Vacations",
      required: true,
    },
    posts: [{type: mongoose.Types.ObjectId, ref: "Posts",}]
  },
  { timestamp: true }
);

module.exports = mongoose.model("Milestones", milestoneModel);
