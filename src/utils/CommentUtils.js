const formatArr = (arr) => {
  const formattedComments = arr.map((comment) => ({
    id: comment.ID,
    text: comment.content,
    author: comment.Name,
    idReply: comment.id_reply,
    level: 0,
    IDAccount: comment.IDAccount,
    replies: [],
  }));
  return formattedComments;
};
const loopArr = (arr, brr) => {
  if (brr.length == 0) {
    return arr;
  }
  let fuck = [];

  arr.forEach((a) => {
    if (a.replies.length != 0) {
      const arrReplay = a.replies;
      arrReplay.forEach((b) => {
        const check = brr.filter((as) => as.idReply == b.id);
        if (check.length != 0) {
          b.replies = check;
          check.level = b.level + 1;
        }
        check.map((ss) => (ss.level = b.level + 1));
        fuck.push(...check);
      });
    } else {
      const b = brr.filter((s) => s.idReply == a.id);
      if (b.length != 0) {
        a.replies = b;
      }
      b.map((ss) => (ss.level += 1));
      fuck.push(...b);
    }
  });

  const a = brr.filter((b) => !fuck.includes(b));
  return loopArr(arr, a);
};

const formatJsonComments = (comments) => {
  const result = [];
  const arrDefault = comments.filter((t) => t.id_reply == null);
  const arrayQuery = comments.filter((t) => t.id_reply != null);
  const array = formatArr(arrDefault);
  const arrayq = formatArr(arrayQuery);
  const a = loopArr(array, arrayq);
  return a;
};
module.exports = { formatJsonComments };
