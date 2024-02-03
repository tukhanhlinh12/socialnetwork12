const { uploadImage, uploadVideo } = require("../../cloudinary");
const postModel = require("../../models/post");
const vacationModel = require("../../models/vacation");
const { postSchema } = require("../post/validation");
const milestoneModel = require("../../models/milestone");
const vacation = require("../../models/vacation");
const { exist } = require("joi");
const { default: mongoose } = require("mongoose");

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel
      .findById(postId)
      .populate("milestone")
      .populate("vacation")
      .populate({ path: "postBy", select: "-password" })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "fullName userName avatar",
        },
      });

    return res.status(200).json({
      sucess: true,
      data: { post },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Đã xảy ra lỗi trong quá trình load bài post" });
  }
};

const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { vacation, milestone, content, likes, comments } = req.body;
    const file = req.file;

    const validate = postSchema.validate({
      vacation,
      milestone,
      content,
    });
    if (validate.error) {
      return res.status(400).json({ error: validate.error.message });
    }

    const existingVacation = await vacationModel.findById(vacation);
    if (!existingVacation) {
      return res.status(404).json({ message: "Không tìm thấy kỳ nghỉ" });
    }

    // Kiểm tra xem user có được post bài k
    if (
      req.userId.toString() !== existingVacation.createdBy.toString() &&
      !existingVacation.participants?.includes(req.userId.toString())
    ) {
      return res.status(403).json({
        message: "Bạn không có quyền cập nhật kỳ nghỉ",
      });
    }

    let milestoneId;
    if (mongoose.Types.ObjectId.isValid(milestone)) {
      const existMilestone = await milestoneModel.findById(milestone);

      if (!existMilestone) {
        return res.status(400).json({ error: "Milestone không tồn tại" });
      }
      milestoneId = milestone;
    } else {
      console.log(milestone);
      const { time, desc } = JSON.parse(milestone);
      console.log(73);
      if (
        new Date(time).getTime() >
          new Date(existingVacation.endedAt).getTime() ||
        new Date(time).getTime() <
          new Date(existingVacation.startedAt).getTime()
      ) {
        return res
          .status(400)
          .json({ message: "Thời gian nằm ngoài kỳ nghỉ. Hãy nhập lại" });
      }
      const newMilestone = await milestoneModel.create({
        time,
        desc,
        vacation: vacation,
      });
      existingVacation.milestones.push(newMilestone);
      await existingVacation.save();
      milestoneId = String(newMilestone._id);
    }

    let data;
    if (file.mimetype.startsWith("image/")) {
      data = await uploadImage(file);
    } else if (file.mimetype.startsWith("video/")) {
      data = await uploadVideo(file);
    } else {
      return res.status(400).json({ error: "Loại tệp không được hỗ trợ" });
    }

    const post = await postModel.create({
      postBy: userId,
      vacation: vacation,
      milestone: milestoneId,
      content,
      likes,
      comments,
      images: data,
    });

    existingVacation.posts.push(post);
    existingVacation.save();

    const milestoneObj = await milestoneModel.findById(milestoneId);

    milestoneObj.posts.push(post);
    milestoneObj.save();

    return res.status(200).json({
      sucess: true,
      message: "Đã tạo bài viết thành công",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { content, postId } = req.body;

    const existingPost = await postModel.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Không tìm thấy bài post" });
    }

    // Kiểm tra xem người đăng nhập có quyền xóa bài post không
    if (req.userId.toString() !== existingPost.postBy.toString()) {
      return res.status(403).json({
        message: "Bạn không thể sửa bài viết của người khác",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: postId },
      { content: content },
      { new: true }
    );

    return res.status(200).json({
      sucess: true,
      message: "Đã chỉnh sửa bài viết thành công",
      data: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message,
      message: "Đã xảy ra lỗi trong quá trình cập nhật bài viết",
    });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(400).json({ message: "Bài post không tồn tại" });
    }

    const vacation = await vacationModel.findById(post.vacation);
    console.log(vacation);

    if (post.likes?.uId?.includes(userId)) {
      await postModel.updateOne(
        { _id: postId },
        { $inc: { "likes.total": -1 }, $pull: { "likes.uId": userId } },
        { new: true }
      );
      await vacationModel.updateOne(
        { _id: post.vacation },
        { $inc: { "likes.total": -1 } },
        { new: true }
      );
    } else {
      await postModel.updateOne(
        { _id: postId },
        { $inc: { "likes.total": 1 }, $push: { "likes.uId": userId } },
        { new: true }
      );
      await vacationModel.updateOne(
        { _id: post.vacation },
        { $inc: { "likes.total": 1 } },
        { new: true }
      );
    }
    return res.status(200).json({
      sucess: true,
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message,
      message: "Đã xảy ra lỗi trong quá trình like bài viết",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const existingPost = await postModel.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Không tìm thấy bài post" });
    }

    // Kiểm tra xem người đăng nhập có quyền xóa bài post không
    if (req.userId.toString() !== existingPost.postBy.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa bài post",
      });
    }

    if (existingPost.comments?.length != 0) {
      const getListComments = existingPost.comments.map((item) => item._id);

      await commentModel.deleteMany({
        postId: {
          $in: getListPost,
        },
      });
    }

    await vacationModel.updateOne(
      { _id: existingPost.vacation.toString() },
      { $pull: { posts: postId } },
      { new: true }
    );

    const deletedPost = await postModel.findByIdAndDelete(postId);

    return res
      .status(200)
      .json({ sucess: true, message: "Xóa bài post thành công" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
      message: "Đã xảy ra lỗi trong quá trình xóa bài viết",
    });
  }
};

module.exports = { createPost, getPost, likePost, deletePost, updatePost };
