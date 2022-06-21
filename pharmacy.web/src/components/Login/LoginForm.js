import { Form, Input, Button, Card, Typography, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const LoginForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const onFinish = async (values) => {
		const url = `/api/v1/auth/login`;
		try {
			const res = await axios.post(url, values);
			dispatch(authActions.login(res.data.user));
			navigate("/");
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "Invalid Credentials.",
			});
		}
	};

	return (
		<Card title={<Title level={3}>Login</Title>}>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
			>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your Email!",
						},
					]}
				>
					<Input
						prefix={
							<UserOutlined className="site-form-item-icon" />
						}
						size="large"
						placeholder="Username"
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
						prefix={
							<LockOutlined className="site-form-item-icon" />
						}
						placeholder="Password"
						size="large"
					/>
				</Form.Item>

				<Form.Item>
					<Button
						size="large"
						type="primary"
						htmlType="submit"
						className="login-form-button"
						block
					>
						Log in
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default LoginForm;
