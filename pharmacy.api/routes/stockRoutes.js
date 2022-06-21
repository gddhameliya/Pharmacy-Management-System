const express = require("express");
const router = express.Router();

const {
	addStock,
	updateStock,
	deleteStock,
	getAllStocks,
	getSingleStock,
} = require("../controllers/stockController");

const {
	authenticateUser,
	authorizePermission,
} = require("../middleware/authentication");

router
	.route("/")
	.get(authenticateUser, authorizePermission("admin", "staff"), getAllStocks);
router
	.route("/")
	.post(authenticateUser, authorizePermission("admin"), addStock);
router
	.route("/:id")
	.patch(authenticateUser, authorizePermission("admin"), updateStock);
router
	.route("/:id")
	.delete(authenticateUser, authorizePermission("admin"), deleteStock);
router
	.route("/:id")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getSingleStock
	);

module.exports = router;
