const express = require("express");
const router = express.Router();
const initApi = (app) => {
  return app.use("/api/v1/", router);
};
module.exports = initApi;
