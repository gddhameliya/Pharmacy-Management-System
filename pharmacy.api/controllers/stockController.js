const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/Product");
const Stock = require("../models/Stock");

const addStock = async (req, res) => {
	const { product, batch, expDate, mfgDate, quantity } = req.body;
	if (!product || !batch || !expDate || !mfgDate || !quantity)
		throw new CustomError.BadRequestError(
			"Please provide product, batch, expDate, mfgDate, and quantity."
		);
	if (quantity <= 0) {
		throw new CustomError.BadRequestError("Please provide valid quantity.");
	}
	const productInDb = await Product.findById(product);

	if (!productInDb)
		throw new CustomError.NotFoundError(`No product with id: ${product}.`);
	const stockInDb = await Stock.findOne({ batch });
	if (stockInDb)
		throw new CustomError.NotFoundError(`Stock already exists in records.`);
	const stock = await Stock.create({
		product,
		batch,
		expDate,
		mfgDate,
		quantity,
	});

	res.status(StatusCodes.CREATED).json({ stock });
};
const updateStock = async (req, res) => {
	const { id: stockId } = req.params;
	const { product, batch, expDate, mfgDate, quantity } = req.body;
	if (!product || !batch || !expDate || !mfgDate || !quantity)
		throw new CustomError.BadRequestError(
			"Please provide product, batch, expDate, mfgDate, and quantity."
		);
	if (quantity <= 0) {
		throw new CustomError.BadRequestError("Please provide valid quantity.");
	}
	const productInDb = await Product.findById(product);
	if (!productInDb)
		throw new CustomError.NotFoundError(`No product with id: ${product}.`);
	const stock = await Stock.findById(stockId);
	if (!stock)
		throw new CustomError.NotFoundError(`No stock with id: ${stockId}.`);
	let totalQty = productInDb.totalQuantity - stock.quantity + quantity;
	await Product.findByIdAndUpdate(product, {
		totalQuantity: totalQty,
	});
	const updatedStock = await Stock.findByIdAndUpdate(
		stockId,
		{
			product,
			batch,
			expDate,
			mfgDate,
			quantity,
		},
		{ runValidators: true, new: true }
	);
	res.status(StatusCodes.OK).json({ updatedStock });
};
const deleteStock = async (req, res) => {
	const { id: stockId } = req.params;
	const stock = await Stock.findById(stockId);
	if (!stock)
		throw new CustomError.NotFoundError(`No stock with id: ${stockId}.`);
	await stock.remove();
	res.status(StatusCodes.OK).json({ msg: "Success! stock deleted." });
	// RES
};
const getAllStocks = async (req, res) => {
	const stocks = await Stock.find({})
		.populate([{ path: "product", model: "Product" }])
		.select();
	res.status(StatusCodes.OK).json({ stocks });
};
const getSingleStock = async (req, res) => {
	const { id: stockId } = req.params;
	const stock = await Stock.findById(stockId)
		.populate([{ path: "product", model: "Product" }])
		.select();
	if (!stock)
		throw new CustomError.NotFoundError(`No stock with id: ${stockId}.`);
	res.status(StatusCodes.OK).json({ stock });
};

module.exports = {
	addStock,
	updateStock,
	deleteStock,
	getAllStocks,
	getSingleStock,
};
