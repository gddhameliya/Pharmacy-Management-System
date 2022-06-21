const { default: mongoose } = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
	product: {
		type: String,
		required: [true, "Please provide product name."],
		trim: true,
	},
	batch: {
		type: String,
		required: [true, "Please provide product batch number."],
		trim: true,
	},
	quantity: {
		type: Number,
		required: [true, "Please provide quantity for invoice."],
	},
	price: {
		type: Number,
		required: [true, "Please provide price for invoice."],
	},
	total: {
		type: Number,
		required: [true, "Please provide total for invoice."],
	},
});

const InvoiceSchema = new mongoose.Schema({
	customer: {
		type: String,
		required: [true, "Please provide customer name."],
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	date: {
		type: Date,
		required: [true, "Please provide invoice date."],
	},
	grandTotal: {
		type: Number,
		required: [true, "Please provide grand total for invoice."],
	},
	orderItems: [OrderItemSchema],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
