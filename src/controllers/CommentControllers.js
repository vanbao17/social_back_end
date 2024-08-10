const pool = require("../configs/connectDB");
const { formatJsonComments } = require("../utils/CommentUtils");
const getCommentsPost = (req, res) => {
  const { IDPost } = req.body;
  const query = `SELECT a.image_user,c.user_id,s.Name,c.content,c.ID as idComment,c.id_reply,a.MSV,a.id as IDAccount
    FROM Comments as c , Account as a, Students as s
    where c.post_id=? and
    a.ID = c.user_id and
    s.MSV = a.MSV`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const final = formatJsonComments(results);
    // return res.send(JSON.stringify(final));
    return res.json(final);
  });
};
const addCommentPost = (req, res) => {
  const { IDPost, UserID, Content, ReplyId } = req.body;
  const query = `insert into Comments(post_id,user_id,content,id_reply) values(?,?,?,?)`;
  pool.query(query, [IDPost, UserID, Content, ReplyId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const updateCommentPost = (req, res) => {
  const { IDComment, Content } = req.body;
  const query = `update Comments set content=? where id = ?`;
  pool.query(query, [Content, IDComment], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const deleteCommentPost = (req, res) => {
  const { IDComment } = req.body;
  const query = `delete from Comments where id = ?`;
  pool.query(query, [IDComment], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const getCountComment = (req, res) => {
  const { IDPost } = req.body;
  const query = `select count(*) from Comments where post_id = ?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
module.exports = {
  getCommentsPost,
  addCommentPost,
  updateCommentPost,
  deleteCommentPost,
};
