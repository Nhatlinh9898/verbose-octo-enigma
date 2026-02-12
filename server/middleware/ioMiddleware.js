// Middleware để truyền io instance vào req object
const ioMiddleware = (req, res, next) => {
  req.io = req.app.get('io');
  next();
};

module.exports = { ioMiddleware };
