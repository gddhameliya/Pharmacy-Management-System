const { default: mongoose } = require("mongoose");

const StockSchema = new mongoose.Schema({
	product: {
		type: mongoose.Types.ObjectId,
		ref: "Product",
		required: [true, "Please provide product name."],
	},
	batch: {
		type: String,
		unique: true,
		required: [true, "Please provide product batch id."],
		trim: true,
	},
	expDate: {
		type: Date,
		required: [true, "Please provide expiry date."],
	},
	mfgDate: {
		type: Date,
		required: [true, "Please provide manufacture date."],
	},
	quantity: {
		type: Number,

		required: [true, "Please provide produc quantity."],
	},
});

StockSchema.pre("save", async function () {
	const productId = this.product;
	const product = await this.model("Product").findById(productId);
	product.totalQuantity += this.quantity;
	product.stocks.push(this._id);
	await product.save();
});

StockSchema.pre("remove", async function () {
	const productId = this.product;
	const product = await this.model("Product").findById(productId);
	product.totalQuantity -= this.quantity;
	const stocksInProduct = [...product.stocks];
	const stockIndexInProductStocks = stocksInProduct.findIndex(
		(stock) => stock.toString() === this._id
	);
	// console.log(stockIndexInProductStocks);
	product.stocks.splice(stockIndexInProductStocks, 1);
	await product.save();
});

module.exports = mongoose.model("Stock", StockSchema);
