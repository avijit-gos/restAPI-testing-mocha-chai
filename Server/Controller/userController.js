/** @format */

const User = require("../Model/UserModel");
const {
  hash_password,
  compare_password,
  generate_token,
} = require("../Helper/Helper");
const { default: mongoose } = require("mongoose");

class UserController {
  constructor() {
    console.log("User controller running!!");
  }

  async register(req, res) {
    const { name, email, username, password } = req.body;
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
      res.status(400).json({ msg: "Invalid registration request" });
    } else {
      var user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (user) {
        return res
          .status(400)
          .json({ msg: "Username or Email has already been taken" });
      } else {
        // *** Hash user password...
        const hash = await hash_password(password);
        if (!hash) {
          return res
            .status(400)
            .json({ msg: "Something went wrong. Try again!" });
        } else {
          const newUser = User({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            username: username,
            email: email,
            password: hash,
          });
          const savedUser = await newUser.save();
          try {
            return res.status(201).json({ msg: "Registration successfull" });
          } catch (error) {
            return res.status(501).json({ msg: error.message });
          }
        }
      }
    }
  }

  async login(req, res) {
    const { logUser, password } = req.body;
    if (!logUser.trim() || !password.trim()) {
      return res.status(400).json({ msg: "Invalid login request" });
    } else {
      var user = await User.findOne({
        $or: [{ username: logUser }, { email: logUser }],
      });
      if (!user) {
        return res.status(400).json({ msg: "Sorry! we cannot found any user" });
      } else {
        // *** Compare user password
        const result = await compare_password(password, user);
        if (!result) {
          return res.status(400).json({ msg: "Invalid creadentials" });
        } else {
          // *** Generate user authentication token
          var token = await generate_token(user);
          if (!token) {
            return res.status(501).json({ msg: "Something went wrong" });
          } else {
            return res
              .status(200)
              .json({ msg: "Login successfull", user: user, token: token });
          }
        }
      }
    }
  }

  async fetchUser(req, res) {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ msg: "User id is missing" });
    } else {
      var user = await User.findById(userId, {
        _id: 1,
        name: 1,
        username: 1,
        email: 1,
      });
      if (!user) {
        return res.status(400).json({ msg: "Sorry! We cannot found any user" });
      } else {
        return res.status(200).json(user);
      }
    }
  }

  async updateUser(req, res) {
    const { name, username, email } = req.body;
    if (!name.trim() || !username.trim() || !email.trim()) {
      return res.status(400).json({ msg: "Invalid update request" });
    } else {
      const user = await User.findById(req.user._id, "-password");
      if (!user) {
        return res.status(400).json({ msg: "No user found" });
      } else {
        const updateUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: { name: name, username: username, email: email },
          },
          // "-password",
          { new: true }
        );
        try {
          // console.log(updateUser);
          return res
            .status(200)
            .json({ msg: "User updated", user: updateUser });
        } catch (error) {
          return res.status(501).json({ msg: error.message });
        }
      }
    }
  }

  async searchUser(req, res) {
    const search = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    var users = await User.find(search)
      .select({
        name: 1,
        username: 1,
        profilePic: 1,
      })
      .find({
        _id: { $ne: req.user._id },
      });
    try {
      return res.status(200).json(users);
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  }

  async deleteUser(req, res) {
    var user = await User.findByIdAndDelete(req.user._id);
    try {
      return res.status(200).json({ msg: "User has been deleted" });
    } catch (error) {
      return res.status(200).json({ msg: error.message });
    }
  }
}

module.exports = new UserController();
