const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const {
  Login,
  changePass,
  imageUser,
  imageBanner,
  inforUser,
  searchUser,
} = require("../controllers/UserControllers");
const {
  getPosts,
  addPost,
  deletePost,
  updatePost,
  getPostsIdPersonal,
} = require("../controllers/PostControllers");
const {
  addFile,
  getFilePost,
  updateFilePost,
} = require("../controllers/FileControllers");
const {
  getCommentsPost,
  addCommentPost,
  updateCommentPost,
  deleteCommentPost,
} = require("../controllers/CommentControllers");
const {
  checkConvensation,
  addConvensation,
  getConvens,
  getMesseages,
} = require("../controllers/MessControllers");

const router = express.Router();
const storage_upload_post = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Xì mười nghìn đây tui mở cho  :))))");
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    req.idCustomers = decoded.id;
    next();
  });
};

const upload_file_post = multer({ storage: storage_upload_post });

const initApi = (app) => {
  router.post("/login", Login);
  router.post("/changePass", verifyToken, changePass);
  router.post("/imageUser", verifyToken, imageUser);
  router.post("/imageBanner", verifyToken, imageBanner);
  router.post("/inforUser", verifyToken, inforUser);
  router.post("/searchUser", verifyToken, searchUser);

  router.get("/posts", verifyToken, getPosts);
  router.post("/addPost", verifyToken, addPost);
  router.post("/addFilePost", verifyToken, addFile);
  router.post("/getFilePost", verifyToken, getFilePost);
  router.post("/updatePost", verifyToken, updatePost);
  router.post("/updateFilePost", verifyToken, updateFilePost);
  router.post("/getPostsIdPersonal", verifyToken, getPostsIdPersonal);
  router.post("/deletePost", verifyToken, deletePost);

  router.post("/getCommentsPost", verifyToken, getCommentsPost);
  router.post("/addCommentPost", verifyToken, addCommentPost);
  router.post("/updateCommentPost", verifyToken, updateCommentPost);
  router.post("/deleteCommentPost", verifyToken, deleteCommentPost);

  router.post("/checkConvensation", verifyToken, checkConvensation);
  router.post("/addConvensation", verifyToken, addConvensation);
  router.post("/getConvens", verifyToken, getConvens);
  router.post("/getMesseages", verifyToken, getMesseages);
  router.post(
    "/upload_file_post",
    upload_file_post.single("file"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
      res.status(200).send({
        message: "File uploaded successfully.",
        file: req.file,
      });
    }
  );
  app.get("/files", (req, res) => {
    fs.readdir("src/assets/image/images_product", (err, files) => {
      if (err) {
        return res.status(500).send("Unable to scan files.");
      }
      const fileInfos = files.map((file) => ({
        name: file,
        url: `http://localhost:3001/uploads/${file}`,
      }));
      res.json(fileInfos);
    });
  });
  return app.use("/api/v1/", router);
};
module.exports = initApi;
