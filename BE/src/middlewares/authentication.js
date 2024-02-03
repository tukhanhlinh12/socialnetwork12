const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    const beazerToken = req.headers.authorization;

    const token = beazerToken?.split(" ")[1];
    const checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = checkToken.id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json("Bạn chưa đăng nhập");
    }

    req.userId = userId;
    req.user = user;
    next()

} catch (error) {
    console.log(error)
    res.status(400).json(" Phiên đăng nhập bạn đã hết hạn")
}
};

module.exports = verifyToken;
