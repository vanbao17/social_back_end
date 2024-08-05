const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../configs/connectDB");
let Login = (req, res) => {
  const { masv, password } = req.body;
  const query =
    "SELECT * FROM Account,Students WHERE Account.MSV = ? and Account.MSV = Students.MSV";
  pool.query(query, [masv], (err, results) => {
    if (err) return res.status(500).send("Server error");
    if (results.length === 0)
      return res.status(401).send("Invalid credentials");
    const user = results[0];
    if (password == user.Password) {
      const token = jwt.sign(
        {
          MSV: user.MSV,
          Name: user.Name,
          LSH: user.LSH,
          Dob: user.Dob,
          Image_user: user.image_user,
          Image_banner: user.image_banner,
          Code: user.Code,
          IDAccount: user.ID,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      return res.status(401).send("Incorrect password");
    }
  });
};
const changePass = (req, res) => {
  const { msv, password, passNew } = req.body;
  const query = "SELECT MSV FROM account WHERE MSV = ? AND Password = ?;";
  pool.query(query, [msv, password], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(201).send("Mật khẩu cũ chưa đúng.");
    }
    pool.query(
      "UPDATE account SET Password = ? WHERE MSV = ?",
      [passNew, msv],
      (e) => {
        if (e) {
          return res.status(500).send(e);
        }

        // Gửi phản hồi thành công sau khi cập nhật thành công
        return res.status(200).send("Mật khẩu đã được cập nhật.");
      }
    );
  });
};
let imageBanner = (req, res) => {
  const { msv, path } = req.body;
  const query = "update account set image_banner=? where MSV=?";
  pool.query(query, [path, msv], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let imageUser = (req, res) => {
  const { msv, path } = req.body;
  const query = "update account set image_user=? where MSV=?";
  pool.query(query, [path, msv], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let inforUser = (req, res) => {
  const { msv } = req.body;
  const query =
    "select a.image_banner,a.image_user,s.LSH,s.Dob,a.ID,s.Name,a.MSV from account as a,students as s where a.MSV=s.MSV and a.MSV=?";
  pool.query(query, [msv], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
let searchUser = (req, res) => {
  const { msv } = req.body;
  const stringLike = "'" + msv + "%" + "'";

  const query =
    "select s.MSV,s.Name,a.image_user FROM account as a, students as s where a.MSV=s.MSV and a.MSV like " +
    stringLike;

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
module.exports = {
  Login,
  changePass,
  imageBanner,
  imageUser,
  inforUser,
  searchUser,
};
