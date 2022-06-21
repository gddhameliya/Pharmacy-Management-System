const express = require("express");
const { login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login).get("/logout", logout);

module.exports = router;
