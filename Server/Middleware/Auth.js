/** @format */

require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = async function (req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(400).json({ msg: "Token missing" });
  } else {
    const verify = await jwt.verify(token, process.env.SECRET_TOKEN);
    try {
      req.user = verify;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  }
};
