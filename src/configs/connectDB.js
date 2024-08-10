const mysql = require("mysql");
const pool = mysql.createConnection({
  host: "localhost",
  user: "psomwqdghosting_mysocial",
  password: "Phamvanbao_0123",
  database: "psomwqdghosting_mysocial",
  insecureAuth: true,
});
pool.connect((err) => {
  if (err) throw err;
  console.log("connected!!");
});
module.exports = pool;
