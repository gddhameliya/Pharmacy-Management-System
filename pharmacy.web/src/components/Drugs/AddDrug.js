import { Form, Input, Modal, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormCard from "../UI/CardForm";

const AddDrug = () => {
	const [suppliersOptions, setSupplierOptions] = useState([]);
	const getSuppliers = async () => {
		try {
			const {
				data: { suppliers },
			} = await axios.get("/api/v1/suppliers");
			const options = [];
			suppliers.map((supplier) =>
				options.push({
					label: supplier.name,
					value: supplier._id,
				})
			);
			setSupplierOptions([...options]);
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "There is an error while fetching suppliers.",
			});
		}
	};
	useEffect(() => {
		getSuppliers();
	}, []);
	const navigate = useNavigate();
	const onFinish = async (values) => {
		// console.log(values);
		try {
			await axios.post("/api/v1/products", values);
			navigate("/manageDrugs");
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "Operation failed.",
			});
		}
	};

	return (
		<FormCard title="Add Drug">
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
			>
				<Form.Item
					name="name"
					rules={[
						{
							required: true,
							message: "Please enter drug name!",
						},
					]}
				>
					<Input
						addonBefore="Drug Name"
						size="large"
						type="text"
						placeholder="Eg. Senac"
					/>
				</Form.Item>
				<Form.Item
					name="genericName"
					rules={[
						{
							required: true,
							message: "Please enter drug generic name!",
						},
					]}
				>
					<Input
						addonBefore="Drug Generic Name"
						size="large"
						type="text"
						placeholder="Eg. Diclofenac"
					/>
				</Form.Item>
				<Form.Item
					name="price"
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
						addonBefore="Drug Price Per Item"
						placeholder="Eg. 2.00"
					/>
				</Form.Item>

				<Form.Item name="supplier">
					<Select
						showSearch
						placeholder="Select Drug Supplier"
						optionFilterProp="children"
						options={suppliersOptions}
						filterOption={(input, option) =>
							option.label
								.toLowerCase()
								.indexOf(input.toLowerCase()) >= 0
						}
					></Select>
				</Form.Item>

				<Form.Item>
					<Button
						variant="success"
						size="large"
						type="submit"
						className="login-form-button"
					>
						Add Drug
					</Button>
				</Form.Item>
			</Form>
		</FormCard>
	);
};

export default AddDrug;
