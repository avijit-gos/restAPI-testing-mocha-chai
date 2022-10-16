/** @format */

const router = require("express").Router();
const {
  register,
  login,
  fetchUser,
  updateUser,
  searchUser,
  deleteUser,
} = require("../Controller/userController");
const Auth = require("../Middleware/Auth");

router.post("/register", register);
router.post("/login", login);

// *** Protected routes
router.get("/:id", Auth, fetchUser);
router.put("/", Auth, updateUser);
router.get("/search", Auth, searchUser);
router.delete("/", Auth, deleteUser);
module.exports = router;
