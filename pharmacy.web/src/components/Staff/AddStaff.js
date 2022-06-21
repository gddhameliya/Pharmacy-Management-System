import { Form, Input, Modal } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormCard from "../UI/CardForm";

const AddStaff = () => {
	const navigate = useNavigate();
	const onFinish = async (values) => {
		try {
			await axios.post("/api/v1/users", values);
			navigate("/manageStaff");
		} catch (error) {
			console.log(error);
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

	// const onFinishFailed = (errorInfo) => {
	// 	console.log("Failed:", errorInfo);
	// };

	return (
		<FormCard title="Add Staff">
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
							message: "Please enter staff name!",
						},
					]}
				>
					<Input
						addonBefore="Staff Name"
						size="large"
						type="text"
						placeholder="Eg. Brent Rivera"
					/>
				</Form.Item>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: "Please enter staff email!",
						},
					]}
				>
					<Input
						addonBefore="Staff Email"
						size="large"
						type="email"
						placeholder="Eg. staff@mail.com"
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: "Please input your Password!",
						},
					]}
				>
					<Input.Password
						addonBefore="Staff Password"
						placeholder="Eg. Secret$72%"
						size="large"
					/>
				</Form.Item>
				<Form.Item
					name="mobile"
					rules={[
						{
							required: true,
							message: "Please input staff mobile number!",
						},
					]}
				>
					<Input
						size="large"
						type="tel"
						maxLength="10"
						addonBefore="Staff Mobile"
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
						Add Staff
					</Button>
				</Form.Item>
			</Form>
		</FormCard>
	);
};

export default AddStaff;
