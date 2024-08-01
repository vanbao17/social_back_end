const pool = require("../configs/connectDB");
const addFile = (req, res) => {
  const { IDPost, Path, FileType, filename } = req.body;
  const query = `insert into uploads(IDPost,Path,FileType,filename) values(?,?,?,?)`;
  pool.query(query, [IDPost, Path, FileType, filename], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const getFilePost = (req, res) => {
  const { IDPost } = req.body;
  const query = `select * from uploads where IDPost =?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const updateFilePost = (req, res) => {
  const { IDUpload, PostId, Path, FileType, filename } = req.body;
  const query = `update  uploads set Path=?,FileType=?,filename=? where IDPost=? and ID=?`;
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
module.exports = {
  addFile,
  getFilePost,
  updateFilePost,
};
