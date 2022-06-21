const { default: mongoose } = require("mongoose");
const validator = require("validator");

var validateNumber = function (mobile) {
	var re = /^[0-9]{10}$/;
	return re.test(mobile);
};
const SupplierSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name."],
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Please provide a email."],
		trim: true,
		validate: {
			validator: validator.isEmail,
			message: "Please provide valid email",
		},
	},
	mobile: {
		type: Number,
		required: [true, "Please provide a mobile number."],
		validate: [validateNumber, "Please provide a valid mobile number."],
	},
});

module.exports = mongoose.model("Supplier", SupplierSchema);
