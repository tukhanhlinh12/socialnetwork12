const { createComment } = require("../controllers/comment");
const { createPost, getPost, likePost, deletePost, updatePost } = require("../controllers/post");
const { login } = require("../controllers/users/userController");
const upload = require('../util/multer')

const router = require("express").Router();


/*--post--*/
router.post("/create-post",login, upload.single("images"), createPost);
router.get("/detail/:id",login, getPost);
router.delete("/detail/:id",login, deletePost);
router.put("/detail",login, updatePost);


/*--react--*/
router.patch("/:id/like",login, likePost);

/*--comment--*/
router.post("/detail/:id",login, createComment);

module.exports = router;
