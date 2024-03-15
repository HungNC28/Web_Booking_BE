const express = require("express");
const router = express.Router();

const TransactionController = require("../controllers/User/TransactionController");

router.post("/transactions/add", TransactionController.TransactionAdd);
router.get("/transactions/user", TransactionController.userTransactions);

router.get("/admin/lastest", TransactionController.lastest);

module.exports = router;
