const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const { checkPermissions } = require("../utils");

const registerUser = async (req, res) => {
	const { email, name, password, mobile } = req.body;

	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists)
		throw new CustomError.BadRequestError("Email already exists.");

	// first registered user is an admin
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? "admin" : "staff";
	const user = await User.create({ email, name, password, mobile, role });

	res.status(StatusCodes.CREATED).json({ user });
};

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: "staff" }).select("-password");

	res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
	const { id: userId } = req.params;
	const user = await User.findById(userId).select("-password");

	if (!user)
		throw new CustomError.NotFoundError(`No user with id: ${userId}.`);

	checkPermissions(req.user, user._id);
	res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
	const { name, email, mobile, password } = req.body;
	if (!name || !email || !mobile)
		throw new CustomError.BadRequestError(
			"Please provide name, email, mobile."
		);

	const userId = req.params.id;
	const user = await User.findById(userId);
	if (!user)
		throw new CustomError.NotFoundError(`No user with id: ${userId}.`);
	user.name = name;
	user.email = email;
	user.mobile = mobile;
	if (password) user.password = password;
	await user.save();

	res.status(StatusCodes.OK).json({ user });
};
const updateUserPassword = async (req, res) => {
	const { newPassword, oldPassword } = req.body;

	if (!newPassword || !oldPassword)
		throw new CustomError.BadRequestError(
			"Please provide old password and new password."
		);

	const { userId } = req.user;

	const user = await User.findById(userId);
	const isPassValid = await user.comparePassword(oldPassword);

	if (!isPassValid)
		throw new CustomError.UnauthenticatedError("Invalid Credentials.");

	user.password = newPassword;
	await user.save();

	res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

const deleteUser = async (req, res) => {
	const userId = req.params.id;
	const user = await User.findById(userId);
	if (!user)
		throw new CustomError.NotFoundError(`No user with id: ${userId}.`);
	await user.remove();
	res.status(StatusCodes.OK).json({ msg: "Success! User deleted." });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
	registerUser,
	deleteUser,
};
