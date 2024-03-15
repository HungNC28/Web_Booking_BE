const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/Admin/Dashboard");

router.get("/admin/dashboard", DashboardController.dashboard);

module.exports = router;
