const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide product name."],
		unique: true,
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	genericName: {
		type: String,
		required: [true, "Please provide product name."],
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	totalQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, "Please provide product price."],
	},
	supplier: {
		type: mongoose.Types.ObjectId,
		ref: "Supplier",
		required: [true, "Please provide product supplier."],
	},
	stocks: {
		type: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Stock",
			},
		],
		default: [],
	},
});

ProductSchema.pre("remove", async function () {
	const stocksToDelete = [...this.stocks];
	stocksToDelete.forEach(async (stockId) => {
		await this.model("Stock").findByIdAndDelete(stockId);
	});
});

module.exports = mongoose.model("Product", ProductSchema);
