/** @format */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class Helper {
  constructor() {
    console.log("Helper fn. running");
  }

  async hash_password(password) {
    if (!password.trim()) {
      return false;
    } else {
      const hash = await bcrypt.hash(password, 10);
      try {
        return hash;
      } catch (error) {
        return false;
      }
    }
  }

  async compare_password(password, user) {
    if (!password.trim() || !user) {
      return false;
    } else {
      var result = await bcrypt.compare(password, user.password);
      try {
        return result;
      } catch (error) {
        return false;
      }
    }
  }

  async generate_token(user) {
    if (!user) {
      return false;
    } else {
      var token = await jwt.sign(
        {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        // { algorithm: "RS256" },
        { expiresIn: "2d" }
      );
      try {
        return token;
      } catch (error) {
        return false;
      }
    }
  }
}

module.exports = new Helper();
