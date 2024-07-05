require("dotenv").config();
const jwt = require("jsonwebtoken");

const RequireLogin = async (req, res) => {
  res.status(200).json({ message: "You are Authenticated!" });
};

const RequireAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Token is not Valid!" });
    }

    if (!payload.isAdmin) {
      return res.status(401).json({ message: "Not Authorized!" });
    }
    
    next();
  });
};

module.exports = { RequireLogin, RequireAdmin };
