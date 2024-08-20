const express = require("express");
const pool = require("./src/configs/connectDB");
const { addFriend, getFriend } = require("./src/controllers/UserControllers");
const socketSever = (socket, io) => {
  socket.on("joinPost", (IDPost) => {
    socket.join(IDPost);
  });
  socket.on("joinMess", (idConven) => {
    socket.join(idConven);
  });
  socket.on("joinSocial", (IDAccount) => {
    socket.join(IDAccount);
  });
  socket.on("leavePost", (postId) => {
    socket.leave(postId);
  });
  socket.on("createComment", (data) => {
    const { ID, IDAccount, Name, content, id_reply, image_user } = data;
    const query = `insert into Comments(post_id,user_id,content,id_reply) values(?,?,?,?)`;
    pool.query(query, [ID, IDAccount, content, id_reply], (err, results) => {
      if (err) throw err;
      const idComment = results.insertId;
      const newComment = {
        idComment,
        ID,
        IDAccount,
        content,
        Name,
        id_reply,
        image_user,
      };
      const queryCount = `select count(*) from Comments where post_id=?`;
      pool.query(queryCount, [ID], (err, rs) => {
        io.to(ID).emit("countComment", rs);
      });
      io.to(ID).emit("newComment", newComment);
    });
  });
  socket.on("updateComment", (data) => {
    const { idPost, IDComment, content } = data;
    const query = `update  Comments set content=? where ID=?`;
    pool.query(query, [content, IDComment], (err, results) => {
      if (err) throw err;
      const updateComment = {
        idPost,
        IDComment,
        content,
      };
      io.to(idPost).emit("updateComment", updateComment);
    });
  });
  socket.on("deleteComment", (data) => {
    const { IDComment, IDPost } = data;
    const query = `delete from Comments where id = ?`;
    pool.query(query, [IDComment], (err, results) => {
      if (err) throw err;
      const deleteComment = {
        IDPost,
        IDComment,
      };
      const queryCount = `select count(*) from Comments where post_id=?`;
      pool.query(queryCount, [IDPost], (err, rs) => {
        io.to(IDPost).emit("countComment", rs);
      });
      io.to(IDPost).emit("deleteResponseComment", deleteComment);
    });
  });
  socket.on("createMessChat", (data) => {
    const { IDConversations, Sender_id, Content, content_type } = data;
    const query = `insert into Messages(IDConversations,Sender_id,Content,content_type) values(?,?,?,?)`;
    pool.query(
      query,
      [IDConversations, Sender_id, Content, content_type],
      (err, results) => {
        if (err) throw err;
        const newMess = {
          IDConversations,
          Sender_id,
          Content,
          content_type,
        };
        io.to(IDConversations).emit("responseMessChat", newMess);
      }
    );
  });
  socket.on("likePost", (data) => {
    const { IDPost, IDAccount } = data;
    const query = `insert into Likes( IDPost,IDAccount ) values(?,?)`;
    pool.query(query, [IDPost, IDAccount], (err, results) => {
      if (err) throw err;
      const countQuery = "SELECT COUNT(*) AS count FROM Likes WHERE IDPost = ?";
      pool.query(countQuery, [IDPost], (err, rs) => {
        if (err) throw err;
        const count = rs[0].count;
        io.to(IDPost).emit("responseCountLike", count);
      });
    });
  });
  socket.on("postNotification", (data) => {
    const { IDPost, IDAccountPost, Sender_id, stateNoti } = data;
    let content = "";
    if (stateNoti == "like") {
      content = "đã thích bài viết của bạn";
    } else {
      if (stateNoti == "messenger") {
        content = "đã nhắn tin cho bạn";
      } else {
        if (stateNoti == "comment") {
          content = "đã bình luận bài viết của bạn";
        } else {
          if (stateNoti == "inviteaccept") {
            content = "đã chấp nhận lời mời kết bạn của bạn";
          } else {
            content = "đã gửi lời mời kết bạn đến bạn";
          }
        }
      }
    }
    const query = `insert into Notifications( IDAccount,IDPost,Sender_id,type,content,is_read ) values(?,?,?,?,?,false)`;
    pool.query(
      query,
      [IDAccountPost, IDPost, Sender_id, stateNoti, content],
      (err, results) => {
        if (err) throw err;
        const IDNotification = results.insertId;
        const countQuery = `select s.Name,a.image_user,s.MSV,n.created_at,n.content,a.ID as sender_id,n.IDAccount,n.type,n.IDPost,n.id as IDNoti from Students as s, Account as a , Notifications as n where n.id = ? AND n.sender_id=a.ID and a.MSV=s.MSV`;
        pool.query(countQuery, [IDNotification], (err, rs) => {
          if (err) throw err;
          io.to(IDAccountPost).emit("responseNoti", rs);
        });
      }
    );
  });
  socket.on("unLikePost", (data) => {
    const { IDPost, IDAccount } = data;
    const query = `delete from Likes where IDPost=? and IDAccount=?`;
    pool.query(query, [IDPost, IDAccount], (err, results) => {
      if (err) throw err;
      const countQuery = "SELECT COUNT(*) AS count FROM Likes WHERE IDPost = ?";
      pool.query(countQuery, [IDPost], (err, rs) => {
        if (err) throw err;
        const count = rs[0].count;
        io.to(IDPost).emit("responseCountLike", count);
      });
    });
  });
  socket.on("addFriend", async (data) => {
    const { ID1, ID2 } = data;
    const responseAddFriend = await addFriend(ID1, ID2);
    const listFriend = await getFriend(responseAddFriend);
    if (listFriend) {
      io.to(ID2).emit("responseAddFriend", listFriend[0]);
    }
  });
};
module.exports = socketSever;
