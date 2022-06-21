const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
	// console.log(requestUser.userId, resourceUserId.toString());
	if (requestUser.role === "admin") return;
	if (requestUser.userId === resourceUserId.toString()) return;
	throw new CustomError.UnauthorizedError(
		"Unauthorized to access this route."
	);
};

module.exports = checkPermissions;
