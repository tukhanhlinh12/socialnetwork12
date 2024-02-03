const milestoneModel = require("../../models/milestone");
const { milestoneSchema } = require("./validation");
const vacationModel = require("../../models/vacation");

const createMilestone = async (req, res) => {
  try {
    const vacationId = req.params.id;
    const { time, desc } = req.body;

    const vacation = await vacationModel.findById(vacationId);

    const validate = milestoneSchema.validate({ time, desc });
    if (validate.error) {
      return res.status(400).json({ error: validate.error.message });
    }

    if (
      new Date(time).getTime() > new Date(vacation.endedAt).getTime() ||
      new Date(time).getTime() < new Date(vacation.startedAt).getTime()
    ) {
      return res
        .status(400)
        .json({ message: "Thời gian nằm ngoài kỳ nghỉ. Hãy nhập lại" });
    }

    const milestone = await milestoneModel.create({
      time,
      desc,
      vacation: vacationId,
    });

    vacation.milestones.push(milestone);
    await vacation.save();

    res.status(200).json({
      sucess: true,
      message: "Đã tạo milestone thành công",
      data: milestone,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Đã xảy ra lỗi trong quá trình tạo milestone" });
  }
};

const getMilestone = async (req, res) => {
  try {
    const milestoneId = req.params.id;

    const existingMilestone = await milestoneModel.findById(milestoneId);
    if (!existingMilestone) {
      return res.status(404).json({ message: "Không tìm thấy milestone" });
    }

    const milestone = await milestoneModel
      .findById(milestoneId)
      .populate("vacation")
      .populate("posts");

    return res.status(200).json({
      sucess: true,
      data: milestone,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Đã xảy ra lỗi trong quá trình load milestone" });
  }
};

const getAllMilestone = async (req, res) => {};

const updateMilestone = async (req, res) => {
  try {
    const userId = req.userId;
    const { desc } = req.body;

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

const deleteMilestone = async (req, res) => {
  try {
    const milestoneId = req.params.id;

    const existingMilestone = await vacationModel.findById(milestoneId);
    if (!existingMilestone) {
      return res.status(404).json({ message: "Không tìm thấy kỳ nghỉ" });
    }

    // Kiểm tra xem người đăng nhập có quyền xóa kỳ nghỉ không
    if (req.userId.toString() !== existingMilestone.createdBy.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa milestone này",
      });
    }

    if (existingMilestone.posts?.length != 0) {
      const listPostId = existingMilestone.posts.map((item) => item._id);
      const getListComments = await commentModel.find({
        postId: {
          $in: listPostId,
        },
      });
      await postModel.find({
        _id: {
          $in: listPostId,
        },
      });

      await commentModel.find({
        postId: {
          $in: listPostId.map((item) => item._id),
        },
      });
    }

    const deletedVacation = await vacationModel.findById(milestoneId);

    return res
      .status(200)
      .json({ sucess: true, message: "Xóa kỳ nghỉ thành công" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
      message: "Đã xảy ra lỗi trong quá trình xóa kỳ nghỉ",
    });
  }
};

module.exports = {
  createMilestone,
  getAllMilestone,
  getMilestone,
  updateMilestone,
  deleteMilestone,
};
