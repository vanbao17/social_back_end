const express = require("express");
const multer = require("multer");
const { Login } = require("../controllers/UserControllers");
const {
  getPosts,
  addPost,
  deletePost,
  updatePost,
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

const router = express.Router();
const storage_upload_post = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload_file_post = multer({ storage: storage_upload_post });

const initApi = (app) => {
  router.post("/login", Login);

  router.get("/posts", getPosts);
  router.post("/addPost", addPost);
  router.post("/addFilePost", addFile);
  router.post("/getFilePost", getFilePost);
  router.post("/updatePost", updatePost);
  router.post("/updateFilePost", updateFilePost);

  router.post("/getCommentsPost", getCommentsPost);
  router.post("/addCommentPost", addCommentPost);
  router.post("/updateCommentPost", updateCommentPost);
  router.post("/deleteCommentPost", deleteCommentPost);

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
