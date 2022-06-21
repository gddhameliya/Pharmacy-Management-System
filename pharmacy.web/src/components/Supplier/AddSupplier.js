import { Form, Input, Modal } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormCard from "../UI/CardForm";

const AddSupplier = () => {
	const navigate = useNavigate();
	const onFinish = async (values) => {
		try {
			await axios.post("/api/v1/suppliers", values);
			navigate("/manageSupplier");
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "Operation failed.",
			});
		}
	};

	// const onFinishFailed = (errorInfo) => {
	// 	console.log("Failed:", errorInfo);
	// };

	return (
		<FormCard title="Add Supplier">
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
							message: "Please enter supplier name!",
						},
					]}
				>
					<Input
						addonBefore="Supplier Name"
						size="large"
						type="text"
						placeholder="Eg. Anna Rivera"
					/>
				</Form.Item>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: "Please enter supplier email!",
						},
					]}
				>
					<Input
						addonBefore="Supplier Email"
						size="large"
						type="email"
						placeholder="Eg. supplier@mail.com"
					/>
				</Form.Item>
				<Form.Item
					name="mobile"
					rules={[
						{
							required: true,
							message: "Please input suppier mobile number!",
						},
						{
							pattern: "[0-9]{10}",
							message: "Please enter 10 digits number.",
						},
					]}
				>
					<Input
						size="large"
						type="tel"
						maxLength="10"
						addonBefore="Supplier Mobile"
						placeholder="Eg. 9564852365"
					/>
				</Form.Item>
				<Form.Item>
					<Button
						variant="success"
						size="large"
						type="submit"
						className="login-form-button"
					>
						Add Supplier
					</Button>
				</Form.Item>
			</Form>
		</FormCard>
	);
};

export default AddSupplier;
