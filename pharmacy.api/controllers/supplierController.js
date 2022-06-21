const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Supplier = require("../models/Supplier");

const addSupplier = async (req, res) => {
	const { name, email, mobile } = req.body;
	if (!name || !email || !mobile)
		throw new CustomError.BadRequestError(
			"Please provide name, email, and mobile."
		);
	const supplier = await Supplier.create({ name, email, mobile });
	res.status(StatusCodes.CREATED).json({ supplier });
};
const updateSupplier = async (req, res) => {
	const { name, email, mobile } = req.body;
	if (!name || !email || !mobile)
		throw new CustomError.BadRequestError(
			"Please provide name, email, and mobile."
		);
	const supplierId = req.params.id;
	const supplier = await Supplier.findById(supplierId);
	if (!supplier)
		throw new CustomError.NotFoundError(
			`No supplier with id: ${supplierId}.`
		);
	supplier.name = name;
	supplier.email = email;
	supplier.mobile = mobile;
	await supplier.save();
	res.status(StatusCodes.OK).json({ supplier });
};
const deleteSupplier = async (req, res) => {
	const supplierId = req.params.id;
	const supplier = await Supplier.findById(supplierId);
	if (!supplier)
		throw new CustomError.NotFoundError(
			`No supplier with id: ${supplierId}.`
		);
	await supplier.remove();
	res.status(StatusCodes.OK).json({ msg: "Success! supplier deleted." });
};
const getAllSuppliers = async (req, res) => {
	const suppliers = await Supplier.find({});

	res.status(StatusCodes.OK).json({ suppliers });
};
const getSingleSupplier = async (req, res) => {
	const { id: supplierId } = req.params;
	const supplier = await Supplier.findById(supplierId);

	if (!supplier)
		throw new CustomError.NotFoundError(
			`No supplier with id: ${supplierId}.`
		);

	res.status(StatusCodes.OK).json({ supplier });
};

module.exports = {
	addSupplier,
	updateSupplier,
	deleteSupplier,
	getAllSuppliers,
	getSingleSupplier,
};
