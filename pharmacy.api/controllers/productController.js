const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

const addProduct = async (req, res) => {
	const { name, genericName, price, supplier } = req.body;
	if (!name || !genericName || !price || !supplier)
		throw new CustomError.BadRequestError(
			"Please provide name, genericName, price, and supplier."
		);
	const supplierInDb = await Supplier.findById(supplier);
	if (!supplierInDb)
		throw new CustomError.NotFoundError(
			`No supplier with id: ${supplier}.`
		);
	let product = await Product.findOne({ name });
	if (product)
		throw new CustomError.BadRequestError(
			"Product already exists in records."
		);
	product = await Product.create({ name, genericName, price, supplier });
	res.status(StatusCodes.CREATED).json({ product });
};
const updateProduct = async (req, res) => {
	const { id: productId } = req.params;
	const { name, genericName, price, supplier } = req.body;
	if (!name || !genericName || !price || !supplier)
		throw new CustomError.BadRequestError(
			"Please provide name, genericName, price, and supplier."
		);
	const supplierInDb = await Supplier.findById(supplier);
	if (!supplierInDb)
		throw new CustomError.NotFoundError(
			`No supplier with id: ${supplier}.`
		);
	let product = await Product.findById(productId);
	if (!product)
		throw new CustomError.NotFoundError(
			`No product with id: ${productId}.`
		);
	product.name = name;
	product.genericName = genericName;
	product.price = price;
	product.supplier = supplier;
	await product.save();
	res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findById(productId);
	if (!product)
		throw new CustomError.NotFoundError(
			`No product with id: ${productId}.`
		);
	await product.remove();
	res.status(StatusCodes.OK).json({ msg: "Success! product deleted." });
};
const getAllProducts = async (req, res) => {
	const products = await Product.find({}).populate([
		{ path: "supplier", model: "Supplier" },
		{ path: "stocks", model: "Stock" },
	]);
	res.status(StatusCodes.OK).json({ products });
};
const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findById(productId).populate([
		{ path: "supplier", model: "Supplier" },
		{ path: "stocks", model: "Stock" },
	]);
	if (!product)
		throw new CustomError.NotFoundError(
			`No product with id: ${productId}.`
		);
	res.status(StatusCodes.OK).json({ product });
};

module.exports = {
	addProduct,
	updateProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
};
