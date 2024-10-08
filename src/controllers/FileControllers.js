const pool = require("../configs/connectDB");
const addFile = (req, res) => {
  const { IDPost, Path, FileType, filename } = req.body;
  const query = `insert into Uploads(IDPost,Path,FileType,filename) values(?,?,?,?)`;
  pool.query(query, [IDPost, Path, FileType, filename], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const getFilePost = (req, res) => {
  const { IDPost } = req.body;
  const query = `select * from Uploads where IDPost =?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const updateFilePost = (req, res) => {
  const { IDUpload, PostId, Path, FileType, filename } = req.body;
  const query = `update  Uploads set Path=?,FileType=?,filename=? where IDPost=? and ID=?`;
  pool.query(
    query,
    [Path, FileType, filename, PostId, IDUpload],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("oke");
    }
  );
};
const getFiles = (req, res) => {
  const { ID } = req.body;
  const query = `SELECT * FROM Uploads as u, Account as a, Students as s,Posts as p where u.IDPost=p.ID and p.IDAccount=a.ID and a.MSV = s.MSV AND a.ID=? ;`;
  pool.query(query, [ID], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
module.exports = {
  addFile,
  getFilePost,
  updateFilePost,
  getFiles,
};
