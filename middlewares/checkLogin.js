var jwt = require("jsonwebtoken");
async function checkLogin(req, res, next) {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized user, no token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
}

module.exports = { checkLogin };
