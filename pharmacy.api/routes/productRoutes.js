const express = require("express");
const router = express.Router();

const {
	addProduct,
	updateProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
} = require("../controllers/productController");

const {
	authenticateUser,
	authorizePermission,
} = require("../middleware/authentication");

router
	.route("/")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getAllProducts
	);
router
	.route("/")
	.post(authenticateUser, authorizePermission("admin"), addProduct);
router
	.route("/:id")
	.patch(authenticateUser, authorizePermission("admin"), updateProduct);
router
	.route("/:id")
	.delete(authenticateUser, authorizePermission("admin"), deleteProduct);
router
	.route("/:id")
	.get(
		authenticateUser,
		authorizePermission("admin", "staff"),
		getSingleProduct
	);

module.exports = router;
