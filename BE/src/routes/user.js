const router = require("express").Router();
const { getAllUser, updateUser, getUser } = require("../controllers/user");
const userController = require("../controllers/users/userController");
const { User } = require("../models/user");
const upload = require("../util/multer");
router.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// dang ki , dang nhap, quen mat khau, thay doi mat khau
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgetpass", userController.forgetPass);
router.post("/changepass/:id", userController.userChangePass);
// --- end user ----

router.get("/get_all_user", getAllUser);
router.get("/get_user",userController.login, getUser);

router.put("/profile/update/:id", upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), updateUser);

// thong tin nguoi dung
router.post("/userinfo", async (req, res) => {
  try {
    const {
      fullName,
      email,
      userName,
      password,
      avatar,
      dateOfBirth,
      gender,
      userInfo,
    } = req.body;

    // Kiểm tra xem các trường bắt buộc có đầy đủ không
    if (!fullName || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
    }

    // Tạo một đối tượng người dùng mới
    const newUser = new User({
      fullName,
      email,
      userName,
      password,
      avatar,
      dateOfBirth,
      gender,
      userInfo,
    });

    // Lưu đối tượng người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Trả về thông tin người dùng đã được thêm vào cơ sở dữ liệu
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
