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
module.exports = {
  Login,
};
