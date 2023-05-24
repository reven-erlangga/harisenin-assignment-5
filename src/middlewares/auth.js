const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    console.log(token);
    const verify = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    req.user = verify;
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  return next();
};
