const express = require("express");
const router = express.Router();

const UserController = require("../controllers/User/UserController");
const AdminController = require("../controllers/Admin/Login");

router.post("/user/signup", UserController.UserSignUp);
router.post("/user/login", UserController.UserLogin);

router.post("/admin/login", AdminController.AdminLogin);

module.exports = router;
