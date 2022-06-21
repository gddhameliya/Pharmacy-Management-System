require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// database
const connectDB = require("./db/connect");

app.set("trust proxy", 1);
// app.use(
// 	rateLimiter({
// 		windowMs: 15 * 60 * 1000,
// 		max: 60,
// 	})
// );
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

// routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/suppliers", require("./routes/supplierRoutes"));
app.use("/api/v1/products", require("./routes/productRoutes"));
app.use("/api/v1/stocks", require("./routes/stockRoutes"));
app.use("/api/v1/invoices", require("./routes/invoiceRoutes"));

// middleware
app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

// server
const PORT = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () =>
			console.log(`Server is listening on port ${PORT}...`)
		);
	} catch (error) {
		console.log(error);
	}
};
start();
