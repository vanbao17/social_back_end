const formatArr = (arr) => {
  const formattedComments = arr.map((comment) => ({
    id: comment.ID,
    text: comment.content,
    author: comment.Name,
    idReply: comment.id_reply,
    level: 0,
    IDAccount: comment.IDAccount,
    MSV: comment.MSV,
    replies: [],
  }));
  return formattedComments;
};
const loopArr = (arr, brr) => {
  let remainingBrr = [...brr];
  let newArr = [...arr];

  while (remainingBrr.length > 0) {
    let tempBrr = [];
    newArr.forEach((a) => {
      if (a.replies.length !== 0) {
        a.replies.forEach((b) => {
          const matchedReplies = remainingBrr.filter(
            (as) => as.idReply === b.id
          );
          if (matchedReplies.length !== 0) {
            b.replies = matchedReplies;
            matchedReplies.forEach((reply) => {
              reply.level = (b.level || 0) + 1;
              tempBrr.push(reply);
            });
          }
        });
      } else {
        const matchedReplies = remainingBrr.filter((s) => s.idReply === a.id);
        if (matchedReplies.length !== 0) {
          a.replies = matchedReplies;
          matchedReplies.forEach((reply) => {
            reply.level = (a.level || 0) + 1;
            tempBrr.push(reply);
          });
        }
      }
    });

    remainingBrr = remainingBrr.filter((b) => !tempBrr.includes(b));
    if (tempBrr.length === 0) break; // Nếu không có reply nào được thêm, dừng vòng lặp
  }

  return newArr;
};

const formatJsonComments = (comments) => {
  const arrDefault = comments.filter((t) => t.id_reply == null);
  const arrayQuery = comments.filter((t) => t.id_reply != null);
  const array = formatArr(arrDefault);
  const arrayq = formatArr(arrayQuery);
  const a = loopArr(array, arrayq);
  return a;
};
module.exports = { formatJsonComments };
