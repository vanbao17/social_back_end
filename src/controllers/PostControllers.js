const pool = require("../configs/connectDB");

const getPosts = (req, res) => {
  const query = `select s.MSV,p.ID,p.Content,a.ID as IDAccount,s.Name,a.Image_user,p.Create_at  from Posts as p, Account as a,Students as s where p.IDAccount=a.ID and s.MSV=a.MSV`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const getPostWithId = (req, res) => {
  const { IDPost } = req.body;
  const query = `select s.MSV,p.ID,p.Content,a.ID as IDAccount,s.Name,a.Image_user,p.Create_at  from Posts as p, Account as a,Students as s where p.IDAccount=a.ID and s.MSV=a.MSV and p.ID=?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const getPostsIdPersonal = (req, res) => {
  const { ID } = req.body;
  const query = `select p.ID,p.Content,a.ID as IDAccount,s.Name,a.Image_user,p.Create_at  from Posts as p, Account as a,Students as s 
where p.IDAccount=a.ID and p.IDAccount=?
and s.MSV=a.MSV`;
  pool.query(query, [ID], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const addPost = (req, res) => {
  const { IDAccount, Content } = req.body;
  const query = `insert into Posts(IDAccount,Content) values(?,?)`;
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
  const query = `delete from Posts where ID=?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("delete successfuly");
  });
};
const updatePost = (req, res) => {
  const { IDPost, Content } = req.body;
  const query = `update Posts set Content=? where ID=?`;
  pool.query(query, [Content, IDPost], (err, results) => {
    const postId = results.insertId;
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("OKE");
  });
};
const getCountLike = (req, res) => {
  const { IDPost } = req.body;
  const query = `select count(*) from Likes where IDPost=?`;
  pool.query(query, [IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const checkUserLike = (req, res) => {
  const { IDAccount, IDPost } = req.body;
  const query = `select count(*) from Likes where IDAccount=? and IDPost = ?`;
  pool.query(query, [IDAccount, IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
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
const checkSavePost = (req, res) => {
  const { IDAccount, IDPost } = req.body;
  const query = `select * from savepost where IDAccount=? and IDPost=?`;
  pool.query(query, [IDAccount, IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const savePost = (req, res) => {
  const { IDAccount, IDPost } = req.body;
  const query = `insert into savepost(IDAccount,IDPost) values(?,?)`;
  pool.query(query, [IDAccount, IDPost], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const getReportType = (req, res) => {
  const query = `SELECT * FROM report_type;`;
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const getSavePost = (req, res) => {
  const { IDAccount } = req.body;
  const query = `select sa.ID,p.ID as IDPost,a.image_user,s.Name,sa.create_at,p.Content from savepost as sa, students as s, account as a, posts as p 
where sa.IDPost=p.ID
AND p.IDAccount=a.ID
AND a.MSV = s.MSV
and sa.IDAccount=?`;
  pool.query(query, [IDAccount], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const deleteSavePost = (req, res) => {
  const { ID } = req.body;
  const query = `delete from savepost where ID=?`;
  pool.query(query, [ID], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const reportPost = (req, res) => {
  const { IDType, IDPost, IDSender } = req.body;
  pool.query(
    "insert into Reports(ID_Report_Type,IDPost,IDSender) values(?,?,?)",
    [IDType, IDPost, IDSender],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("oke");
    }
  );
};
module.exports = {
  getPosts,
  addPost,
  deletePost,
  updatePost,
  getPostsIdPersonal,
  getCountLike,
  checkUserLike,
  getCountComment,
  getPostWithId,
  savePost,
  checkSavePost,
  getSavePost,
  deleteSavePost,
  getReportType,
  reportPost,
};
