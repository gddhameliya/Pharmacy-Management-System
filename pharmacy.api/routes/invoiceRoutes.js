const express = require("express");
const router = express.Router();

const {
	addInvoice,
	getAllInvoices,
	getSingleInvoice,
} = require("../controllers/invoiceController");

const {
	authenticateUser,
	authorizePermission,
} = require("../middleware/authentication");

router
	.route("/")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getAllInvoices
	);
router
	.route("/")
	.post(authenticateUser, authorizePermission("admin", "staff"), addInvoice);
router
	.route("/:id")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getSingleInvoice
	);

module.exports = router;
