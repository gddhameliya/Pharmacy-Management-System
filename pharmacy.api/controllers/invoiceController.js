const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Stock = require("../models/Stock");

const addInvoice = async (req, res) => {
	const { customer, date, grandTotal, orderItems } = req.body;
	if (!customer || !date || !grandTotal || orderItems.length === 0)
		throw new CustomError.BadRequestError(
			"Please provide customer, date, grandTotal, and orderItems."
		);
	let grandTotalCheck = 0;
	for (let i = 0; i < orderItems.length; i++) {
		const { product, batch, quantity, price, total } = orderItems[i];
		if (!product || !batch || !quantity || !price || !total)
			throw new CustomError.BadRequestError(
				"Please provide product, batch, quantity, price, and total in orderItems."
			);
		if (quantity <= 0)
			throw new CustomError.BadRequestError(
				`Invalid quantity for ${product}.`
			);
		const productInDb = await Product.findOne({ name: product });
		if (!productInDb)
			throw new CustomError.NotFoundError(`Invalid product: ${product}.`);
		const stockInDb = await Stock.findOne({
			batch,
			product: productInDb._id,
		});
		if (!stockInDb)
			throw new CustomError.NotFoundError(
				`Invalid batch for ${product}.`
			);
		if (quantity > stockInDb.quantity)
			throw new CustomError.BadRequestError(
				`Invalid quantity for ${product}.`
			);
		if (productInDb.price !== price)
			throw new CustomError.BadRequestError(
				`Invalid price for ${product}.`
			);
		const totalCheck = price * quantity;
		if (totalCheck !== total)
			throw new CustomError.BadRequestError(
				`Invalid total for ${product}.`
			);
		grandTotalCheck += totalCheck;
	}
	if (grandTotalCheck !== grandTotal)
		throw new CustomError.BadRequestError(`Invalid grand total.`);
	for (let i = 0; i < orderItems.length; i++) {
		const { product, batch, quantity, price, total } = orderItems[i];
		const productInDb = await Product.findOne({ name: product });
		const stockInDb = await Stock.findOne({
			batch,
			product: productInDb._id,
		});

		if (quantity === stockInDb.quantity) {
			await stockInDb.remove();
		} else {
			let totalQtyProduct = productInDb.totalQuantity - quantity;
			await Product.findByIdAndUpdate(productInDb._id, {
				totalQuantity: totalQtyProduct,
			});
			let totalQtyStock = stockInDb.quantity - quantity;
			await Stock.findByIdAndUpdate(stockInDb._id, {
				quantity: totalQtyStock,
			});
		}
	}
	const invoice = await Invoice.create({
		customer,
		date,
		grandTotal,
		orderItems,
	});
	res.status(StatusCodes.CREATED).json({ invoice });
};
const getAllInvoices = async (req, res) => {
	const invoices = await Invoice.find({});
	res.status(StatusCodes.OK).json({ invoices });
};
const getSingleInvoice = async (req, res) => {
	const { id: invoiceId } = req.params;
	const invoice = await Invoice.findById(invoiceId);
	if (!invoice)
		throw new CustomError.NotFoundError(
			`No invoice with id: ${invoiceId}.`
		);
	res.status(StatusCodes.OK).json({ invoice });
};

module.exports = {
	addInvoice,
	getAllInvoices,
	getSingleInvoice,
};
