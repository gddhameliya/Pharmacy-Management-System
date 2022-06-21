const express = require("express");
const router = express.Router();

const {
	addSupplier,
	updateSupplier,
	deleteSupplier,
	getAllSuppliers,
	getSingleSupplier,
} = require("../controllers/supplierController");

const {
	authenticateUser,
	authorizePermission,
} = require("../middleware/authentication");

router
	.route("/")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getAllSuppliers
	);
router
	.route("/")
	.post(authenticateUser, authorizePermission("admin"), addSupplier);
router
	.route("/:id")
	.patch(authenticateUser, authorizePermission("admin"), updateSupplier);
router
	.route("/:id")
	.delete(authenticateUser, authorizePermission("admin"), deleteSupplier);
router
	.route("/:id")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getSingleSupplier
	);

module.exports = router;
