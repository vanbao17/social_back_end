const pool = require("../configs/connectDB");

const getPosts = (req, res) => {
  const query = `select s.MSV,p.ID,p.Content,a.ID as IDAccount,s.Name,a.Image_user,p.Create_at  from posts as p, account as a,students as s 
where p.IDAccount=a.ID 
and s.MSV=a.MSV`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("server error");
    }
    return res.json(results);
  });
};
const getPostsIdPersonal = (req, res) => {
  const { ID } = req.body;
  const query = `select p.ID,p.Content,a.ID as IDAccount,s.Name,a.Image_user,p.Create_at  from posts as p, account as a,students as s 
where p.IDAccount=a.ID and p.IDAccount=?
and s.MSV=a.MSV`;
  pool.query(query, [ID], (err, results) => {
    if (err) {
      return res.status(500).send("server error");
    }
    return res.json(results);
  });
};
const addPost = (req, res) => {
  const { IDAccount, Content } = req.body;
  const query = `insert into posts(IDAccount,Content) values(?,?)`;
  pool.query(query, [IDAccount, Content], (err, results) => {
    const postId = results.insertId;
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(postId);
  });
};
const deletePost = (req, res) => {
  const { IDPost } = req.body;
  const query = `delete from posts where ID=?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("delete successfuly");
  });
};
const updatePost = (req, res) => {
  const { IDPost, Content } = req.body;
  const query = `update posts set Content=? where ID=?`;
  pool.query(query, [Content, IDPost], (err, results) => {
    const postId = results.insertId;
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("OKE");
  });
};
module.exports = {
  getPosts,
  addPost,
  deletePost,
  updatePost,
  getPostsIdPersonal,
};
