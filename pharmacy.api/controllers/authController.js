const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		throw new CustomError.BadRequestError(
			"Please provide email and password."
		);

	const user = await User.findOne({ email });
	if (!user)
		throw new CustomError.UnauthenticatedError(`Invalid Credentials.`);

	const isValidPassword = await user.comparePassword(password);

	if (!isValidPassword)
		throw new CustomError.UnauthenticatedError(`Invalid Credentials.`);

	const tokenUser = createTokenUser(user);
	attachCookiesToResponse({ payload: tokenUser, res });

	res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (req, res) => {
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: "User logged out." });
};

module.exports = { login, logout };
