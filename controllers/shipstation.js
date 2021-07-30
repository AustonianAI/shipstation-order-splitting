exports.newOrder = (req, res, next) => {
  console.log("webhook received");
  console.log(req);

  res.status(200).json({
    message: "Got the post",
  });
};

exports.test = (req, res, next) => {
  res.status(200).json({
    message: "hello world!",
  });
};
