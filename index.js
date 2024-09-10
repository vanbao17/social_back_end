const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = 3001;
const initApi = require("./src/routes/api");
const viewEngine = require("./src/configs/viewEngine");
const http = require("http").createServer(app);
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(
  "/upload_file_post",
  express.static(path.join(__dirname, "src/assets/files"))
);
app.use("/upload_file_post", express.static("src/assets/files"));
app.use("/uploads", express.static("src/assets/files"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
dotenv.config();
http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("oke");
});
initApi(app);
viewEngine(app);
app.use(express.static(path.join(__dirname, "build")));

//socket
const socketIo = require("socket.io");
const socketSever = require("./serverSocket");
// const socketSever = require("./serverSocket");
const io = socketIo(http, {
  cors: {
    origin: "http://localhost:3000", // Đảm bảo đây là địa chỉ frontend của bạn
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
  allowEIO3: true,
});
io.on("connection", (socket) => {
  socketSever(socket, io);
});
