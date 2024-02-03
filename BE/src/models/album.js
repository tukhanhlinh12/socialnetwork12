const mongoose = require("mongoose");

const albumModel = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    title: { type: String },
    desc: { type: String },
    images: [{ type: String }],
    thumbnail:{type: String},
    // vacation: [{ type: mongoose.Types.ObjectId, ref: "Vacations" }],
    // likes: { uId: [{ type: String }], total: { type: Number, default: 0 } },
    // comments: [{ type: mongoose.Types.ObjectId, ref: "Comments" }],
    // posts: [{ type: mongoose.Types.ObjectId, ref: "Posts" }],
    privacy: {
      type: String,
      enum: ["onlyMe", "onlyUserChoose", "public"],
      default: "public",
    },
    userChoose: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Albums", albumModel);
