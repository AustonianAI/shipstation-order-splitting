exports.newOrder = (req, res, next) => {
  res.status(200).json({
    message: "Got the post",
    body: req.body,
  });
};

exports.test = (req, res, next) => {
  res.status(200).json({
    message: "hello world!",
  });
};
