const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../configs/connectDB");
let login = (req, res) => {
  const { masv, password } = req.body;
  const query =
    "SELECT * FROM Account,Students WHERE Account.MSV = ? and Account.MSV = Students.MSV";
  const secretKey = "Phamvanbao_0123";
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
        secretKey,
        { expiresIn: "1h" }
      );
      return res.json({ token });
    } else {
      return res.status(201).send("Incorrect password");
    }
  });
};
const changePass = (req, res) => {
  const { msv, password, passNew } = req.body;
  const query = "SELECT MSV FROM Account WHERE MSV = ? AND Password = ?;";
  pool.query(query, [msv, password], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(201).send("Mật khẩu cũ chưa đúng.");
    }
    pool.query(
      "UPDATE Account SET Password = ? WHERE MSV = ?",
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
  const query = "update Account set image_banner=? where MSV=?";
  pool.query(query, [path, msv], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let imageUser = (req, res) => {
  const { msv, path } = req.body;
  const query = "update Account set image_user=? where MSV=?";
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
    "select a.image_banner,a.image_user,s.LSH,s.Dob,a.ID,s.Name,a.MSV from Account as a,Students as s where a.MSV=s.MSV and a.MSV=?";
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
    "SELECT s.*, a.* FROM Students s JOIN Account a ON s.MSV = a.MSV WHERE s.Name LIKE CONCAT('%', ?, '%') OR s.MSV like CONCAT(?, '%');";

  pool.query(query, [msv, msv], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
let getNoti = (req, res) => {
  const { IDAccount } = req.body;
  const query = `select s.Name,a.image_user,s.MSV,n.created_at,n.content,a.ID as sender_id,n.IDAccount,n.type,n.IDPost,n.is_read,n.id as IDNoti from Students as s, Account as a , Notifications as n where n.IDAccount=? and a.ID=n.sender_id and s.MSV=a.MSV`;

  pool.query(query, [IDAccount], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(results);
  });
};
let deleteNotification = (req, res) => {
  const { sender_id, IDPost, stateNoti } = req.body;
  const query = `delete from Notifications where sender_id=? and IDPost=? and type=?`;
  pool.query(query, [sender_id, IDPost, stateNoti], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let updateIsRead = (req, res) => {
  const { IDNoti } = req.body;
  const query = `update Notifications set is_read=1 where id=?`;
  pool.query(query, [IDNoti], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
const getFriend = (ID) => {
  return new Promise((rs, rj) => {
    const query = "select * from Friendships where ID=?";
    pool.query(query, [ID], (err, results) => {
      if (err) {
        rj(err);
      }
      rs(results);
    });
  });
};
let addFriend = (ID1, ID2) => {
  return new Promise((resolve, reject) => {
    const query = `insert into Friendships(IDCustomer1,IDCustomer2,Status) values (?,?,'pending')`;

    pool.query(query, [ID1, ID2], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.insertId);
    });
  });
};
let getMyFriendSend = (req, res) => {
  const { ID } = req.body;
  const query = `select f.IDCustomer1,f.IDCustomer2,f.ID as idFriendShips ,a.MSV,f.Status,a.image_user,s.Name  from Friendships as f,students as s,account as a where f.IDCustomer2 = ? and f.IDCustomer1=a.ID and a.MSV = s.MSV and f.Status='pending'`;
  pool.query(query, [ID], (err, rs) => {
    if (err) throw err;
    return res.json(rs);
  });
};
let getMySended = (req, res) => {
  const { ID } = req.body;
  const query = `select f.IDCustomer1,f.IDCustomer2,f.ID as idFriendShips ,a.MSV,f.Status,a.image_user,s.Name  from Friendships as f,students as s,account as a where f.IDCustomer1 = ? and f.IDCustomer2=a.ID and a.MSV = s.MSV and f.Status='pending'`;
  pool.query(query, [ID], (err, rs) => {
    if (err) throw err;
    return res.json(rs);
  });
};
let getMyFriends = (req, res) => {
  const { ID } = req.body;
  const query = `SELECT 
    CASE 
        WHEN f.IDCustomer1 = ? THEN f.IDCustomer2
        ELSE f.IDCustomer1
    END as FriendID,
    f.ID as idFriendShips, 
    a.MSV, 
    f.Status, 
    a.image_user, 
    s.Name
FROM 
    Friendships as f
JOIN 
    Account as a 
    ON (a.ID = CASE 
                 WHEN f.IDCustomer1 = ? THEN f.IDCustomer2
                 ELSE f.IDCustomer1
               END)
JOIN 
    Students as s 
    ON a.MSV = s.MSV
WHERE 
    (f.IDCustomer2 = ? OR f.IDCustomer1 = ?)
    AND f.Status = 'accepted';;
`;
  pool.query(query, [ID, ID, ID, ID], (err, rs) => {
    if (err) throw err;
    return res.json(rs);
  });
};
let checkFriend = (req, res) => {
  const { ID1, ID2 } = req.body;
  const query =
    "select * from Students as s, account as a,friendships as f where s.MSV=a.MSV and f.IDCustomer2=a.ID and f.IDCustomer1=? and f.IDCustomer2=?";
  pool.query(query, [ID1, ID2], (err, rs) => {
    if (err) throw err;
    return res.json(rs);
  });
};
let cancelInvite = (req, res) => {
  const { ID1, ID2 } = req.body;
  const query = "delete from Friendships where IDCustomer1=? and IDCustomer2=?";
  pool.query(query, [ID1, ID2], (err, rs) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let deleteInvite = (req, res) => {
  const { ID } = req.body;
  const query = "delete from Friendships where ID=?";
  pool.query(query, [ID], (err, rs) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let acceptInvite = (req, res) => {
  const { ID } = req.body;
  const query = "update Friendships set Status='accepted' where ID=?";
  pool.query(query, [ID], (err, rs) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
let declineInvite = (req, res) => {
  const { ID } = req.body;
  const query = "update Friendships set Status='declined' where ID=?";
  pool.query(query, [ID], (err, rs) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send("oke");
  });
};
module.exports = {
  login,
  changePass,
  imageBanner,
  imageUser,
  inforUser,
  searchUser,
  getNoti,
  deleteNotification,
  updateIsRead,
  addFriend,
  getFriend,
  checkFriend,
  getMyFriendSend,
  getMySended,
  getMyFriends,
  declineInvite,
  acceptInvite,
  cancelInvite,
  deleteInvite,
};
