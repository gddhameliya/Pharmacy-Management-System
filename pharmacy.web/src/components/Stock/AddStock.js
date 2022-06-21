import { Form, Input, Modal, Select, DatePicker } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormCard from "../UI/CardForm";

const AddStock = () => {
	const [productsOptions, setProductsOptions] = useState([]);
	const getProducts = async () => {
		try {
			const {
				data: { products },
			} = await axios.get("/api/v1/products");
			const options = [];
			products.map((product) =>
				options.push({
					label: product.name,
					value: product._id,
				})
			);
			setProductsOptions([...options]);
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "There is an error while fetching products.",
			});
		}
	};
	useEffect(() => {
		getProducts();
	}, []);
	const navigate = useNavigate();
	const onFinish = async (values) => {
		try {
			await axios.post("/api/v1/stocks", values);
			navigate("/manageStock");
		} catch (error) {
			if (error.response.data.msg) {
				Modal.error({
					title: "Error",
					content: error.response.data.msg,
				});
			} else {
				Modal.error({
					title: "Error",
					content: "Operation failed.",
				});
			}
		}
	};

	return (
		<FormCard title="Add Stock">
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
			>
				<Form.Item name="product">
					<Select
						showSearch
						placeholder="Select Drug"
						optionFilterProp="children"
						options={productsOptions}
						filterOption={(input, option) =>
							option.label
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}
					></Select>
				</Form.Item>
				<Form.Item
					name="batch"
					rules={[
						{
							required: true,
							message: "Please enter drug batch!",
						},
					]}
				>
					<Input
						addonBefore="Drug Batch"
						size="large"
						type="text"
						placeholder="Eg. S01"
					/>
				</Form.Item>
				<Form.Item
					name="mfgDate"
					rules={[
						{
							required: true,
							message: "Please select drug's manufacturing date!",
						},
					]}
				>
					<DatePicker size="large" placeholder="Drug MFG Date" />
				</Form.Item>
				<Form.Item
					name="expDate"
					rules={[
						{
							required: true,
							message: "Please select drug's expiry date!",
						},
					]}
				>
					<DatePicker size="large" placeholder="Drug EXP Date" />
				</Form.Item>
				<Form.Item
					name="quantity"
					rules={[
						{
							required: true,
							message: "Please input suppier mobile number!",
						},
					]}
				>
					<Input
						size="large"
						type="number"
						addonBefore="Drug Quantity"
						placeholder="Eg. 20"
					/>
				</Form.Item>

				<Form.Item>
					<Button
						variant="success"
						size="large"
						type="submit"
						className="login-form-button"
					>
						Add Stock
					</Button>
				</Form.Item>
			</Form>
		</FormCard>
	);
};

export default AddStock;
