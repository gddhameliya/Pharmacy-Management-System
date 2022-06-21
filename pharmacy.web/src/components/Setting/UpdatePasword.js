import { Form, Input, Modal } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth";
import CardForm from "../UI/CardForm";

const UpdatePassword = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const onFinish = async (values) => {
		try {
			await axios.patch("/api/v1/users/updateUserPassword", values);
			await axios.get("/api/v1/auth/logout");
			dispatch(authActions.logout());
			navigate("/");
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
		<CardForm title="Update Password">
			<Form
				name="password-change"
				className="login-form"
				onFinish={onFinish}
			>
				<Form.Item
					name="oldPassword"
					rules={[
						{
							required: true,
							message: "Please enter old password!",
						},
					]}
				>
					<Input
						addonBefore="Old Password"
						size="large"
						type="text"
						placeholder="Eg. old-secret"
					/>
				</Form.Item>
				<Form.Item
					name="newPassword"
					rules={[
						{
							required: true,
							message: "Please enter new password!",
						},
					]}
				>
					<Input
						addonBefore="New Password"
						size="large"
						type="text"
						placeholder="Eg. new-secret"
					/>
				</Form.Item>
				<Form.Item>
					<Button variant="success" size="sm" type="submit">
						Update Password
					</Button>
				</Form.Item>
			</Form>
		</CardForm>
	);
};

export default UpdatePassword;
