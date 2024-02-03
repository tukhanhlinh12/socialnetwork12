const { albumSchema } = require("../album/validation");
const albumModel = require("../../models/album");
const { uploadImage, uploadVideo } = require("../../cloudinary");

const createAlbum = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, privacy, images, userChoose } = req.body;
    const file = req.file;

    const validate = albumSchema.validate({
      title,
      privacy,
    });

    if (validate.error) {
      return res.status(400).json({ error: validate.error.message });
    }

    let data;
    if (file.mimetype.startsWith("image/")) {
      data = await uploadImage(file);
    } else {
      return res.status(400).json({ error: "Loại tệp không được hỗ trợ" });
    }

    if (privacy === "onlyUserChoose") {
      album = await albumModel.create({
        createdBy: userId,
        images,
        title,
        thumbnail: data,
        privacy,
        userChoose,
      });
    } else if (privacy === "onlyMe" || privacy === "public") {
      album = await albumModel.create({
        createdBy: userId,
        images,
        title,
        thumbnail: data,
        privacy,
      });
    }
 
    return res.status(200).json({
      sucess: true,
      message: "Đã tạo album thành công",
      data: album,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Đã xảy ra lỗi trong quá trình tạo album" });
  }
};
const getAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;

    const existingAlbum = await albumModel.findById(albumId);
    if (!existingAlbum) {
      return res.status(404).json({ message: "Không tìm thấy album" });
    }

    const album = await albumModel
      .findById(albumId)
      .populate({ path: "createdBy", select: "-password" });

    return res.status(200).json({
      sucess: true,
      data: album,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Đã xảy ra lỗi trong quá trình load album" });
  }
};
const getAllAlbums = async (req, res) => {
  try {
    const pageIndex = req.query.pageIndex || 1;
    const pageSize = req.query.pageSize || 5;
    const userId = req.userId;

    const albums = await albumModel
      .find({
        $or: [{ privacy: "public" }, { userChoose: userId }],
      })
      .sort({
        updatedAt: -1,
      })
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "userChoose", select: "-password" })
      .skip(pageSize * pageIndex - pageSize)
      .limit(pageSize);

    return res.status(200).json({ sucess: true, data: albums });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Đã xảy ra lỗi trong quá trình load albums" });
  }
};
const updateAlbum = async (req, res) => {};
const deleteAlbum = async (req, res) => {
  try {
    const userId = req.userId;
    const albumId = req.params.id;

    const existingAlbum = await albumModel.findById(albumId);
    if (!existingAlbum) {
      return res.status(404).json({ message: "Không tìm thấy album" });
    }

    // Kiểm tra xem người đăng nhập có quyền xóa bài post không
    if (req.userId.toString() !== existingAlbum.createdBy.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa album",
      });
    }

    const deletedAlbum = await albumModel.findByIdAndDelete(albumId);

    return res
      .status(200)
      .json({ sucess: true, message: "Xóa album thành công" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error.message,
      message: "Đã xảy ra lỗi trong quá trình xóa album",
    });
  }
};

module.exports = { createAlbum, getAllAlbums, deleteAlbum };
