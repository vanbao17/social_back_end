const pool = require("../configs/connectDB");

const addConvensation = (req, res) => {
  const { IDAccount1, IDAccount2 } = req.body;
  const query = `insert into conversations(IDAccount1,IDAccount2) values(?,?)`;
  pool.query(query, [IDAccount1, IDAccount2], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    const idConven = results.insertId;
    return res.json(idConven);
  });
};
const checkConvensation = (req, res) => {
  const { IDAccount2 } = req.body;
  const query = `select * from conversations where IDAccount2=? or IDAccount1=?`;
  pool.query(query, [IDAccount2, IDAccount2], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const getConvens = (req, res) => {
  const { id } = req.body;
  const query = `SELECT c.ID AS IDConversations, CASE WHEN c.IDAccount1 =? THEN s2.Name WHEN c.IDAccount2 =? THEN s1.Name END AS Name, CASE WHEN c.IDAccount1 =? THEN acc2.image_user WHEN c.IDAccount2 =? THEN acc1.image_user END AS image_user, CASE WHEN c.IDAccount1 =? THEN acc2.MSV WHEN c.IDAccount2 =? THEN acc1.MSV END AS MSV FROM Conversations c JOIN Account acc1 ON c.IDAccount1 = acc1.ID JOIN Account acc2 ON c.IDAccount2 = acc2.ID JOIN Students s1 ON acc1.MSV = s1.MSV JOIN Students s2 ON acc2.MSV = s2.MSV WHERE c.IDAccount1 =? OR c.IDAccount2 =?;`;
  pool.query(query, [id, id, id, id, id, id, id, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
const getMesseages = (req, res) => {
  const { id } = req.body;
  const query = `SELECT * FROM messages as m, conversations as c where c.ID=? and c.ID=m.IDConversations;`;
  pool.query(query, [id, id, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
module.exports = {
  addConvensation,
  checkConvensation,
  getConvens,
  getMesseages,
};
