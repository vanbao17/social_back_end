const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = 3001;
const initApi = require("./src/routes/api");
const viewEngine = require("./src/configs/viewEngine");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.listen(PORT, (req, res) => {
  console.log("starrting nodejs");
});
app.get("/", (req, res) => {
  res.send("oke");
});
app.set("views", path.join(__dirname + "/src/views/"));
app.set("view engine", "ejs");
initApi(app);
viewEngine(app);
