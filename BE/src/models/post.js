const { date } = require("joi");
const mongoose = require("mongoose");

const postModel = new mongoose.Schema(
  {
    postBy: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    vacation: {
      type: mongoose.Types.ObjectId,
      ref: "Vacations",
      // required: true,
    },
    milestone: {
      type: mongoose.Types.ObjectId,
      ref: "Milestones",
      // required: true,
    },
    content: { type: String },
    images: { type: String },
    likes: { uId: [{ type: String }], total: { type: Number, default: 0 } },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postModel);
