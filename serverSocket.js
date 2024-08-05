const express = require("express");
const pool = require("./src/configs/connectDB");
const socketSever = (socket, io) => {
  socket.on("joinPost", (IDPost) => {
    socket.join(IDPost);
  });
  socket.on("joinMess", (idConven) => {
    console.log("join mess" + idConven);

    socket.join(idConven);
  });
  socket.on("leavePost", (postId) => {
    socket.leave(postId);
  });
  socket.on("createComment", (data) => {
    const { ID, IDAccount, Name, content, id_reply } = data;
    const query = `insert into comments(post_id,user_id,content,id_reply) values(?,?,?,?)`;
    pool.query(query, [ID, IDAccount, content, id_reply], (err, results) => {
      if (err) throw err;
      const newComment = {
        ID,
        IDAccount,
        content,
        Name,
        id_reply,
      };
      io.to(ID).emit("newComment", newComment);
    });
  });
  socket.on("deleteComment", (data) => {
    const { IDComment, IDPost } = data;
    const query = `delete from comments where id = ?`;
    pool.query(query, [IDComment], (err, results) => {
      if (err) throw err;
      const deleteComment = {
        IDPost,
        IDComment,
      };
      io.to(IDPost).emit("deleteResponseComment", deleteComment);
    });
  });
  socket.on("createMessChat", (data) => {
    const { IDConversations, Sender_id, Content, content_type } = data;
    const query = `insert into messages(IDConversations,Sender_id,Content,content_type) values(?,?,?,?)`;
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
};
module.exports = socketSever;
