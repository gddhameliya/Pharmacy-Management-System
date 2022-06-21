const express = require("express");
const router = express.Router();

const {
	registerUser,
	getAllUsers,
	showCurrentUser,
	updateUser,
	updateUserPassword,
	getSingleUser,
	deleteUser,
} = require("../controllers/userController");

const {
	authenticateUser,
	authorizePermission,
} = require("../middleware/authentication");

router
	.route("/")
	.get(authenticateUser, authorizePermission("admin"), getAllUsers);
router
	.route("/")
	.post(authenticateUser, authorizePermission("admin"), registerUser);
router
	.route("/:id")
	.delete(authenticateUser, authorizePermission("admin"), deleteUser);

router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
router
	.route("/:id")
	.patch(authenticateUser, authorizePermission("admin"), updateUser);

router.route("/showMe").get(authenticateUser, showCurrentUser);

// Note: ':id; is placed at the end 'cause after '/api/v1/ <- here anything is treated as id for instance 'showMe' will be treated as a id so to avoid that we place at the end.
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
