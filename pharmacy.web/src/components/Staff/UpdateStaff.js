import { Modal, Button } from "react-bootstrap";
import { Form, Input, Modal as AntdModal } from "antd";
import axios from "axios";
import CardTable from "../UI/CardTable";

const UpdateStaff = (props) => {
	const onFinish = async (values) => {
		try {
			await axios.patch(`/api/v1/users/${props.staffDetails.id}`, values);
			props.onClose();
		} catch (error) {
			props.onClose();
			if (error.response.data.msg) {
				AntdModal.error({
					title: "Error",
					content: error.response.data.msg,
				});
			} else {
				AntdModal.error({
					title: "Error",
					content: "Operation failed.",
				});
			}
		}
	};
	const onCloseHandler = () => {
		props.onClose();
	};
	console.log(props);
	return (
		<Modal
			show={props.show}
			onHide={props.onClose}
			backdrop="static"
			keyboard={false}
			size="lg"
		>
			<Modal.Header closeButton>
				<Modal.Title>Update Staff</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<CardTable>
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{
							name: props.staffDetails.name,
							email: props.staffDetails.email,
							mobile: props.staffDetails.mobile,
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
						<Form.Item name="password">
							<Input.Password
								minLength={6}
								addonBefore="Staff New Password"
								placeholder="Eg. Secret$72%"
								size="large"
							/>
						</Form.Item>
						<Form.Item
							name="mobile"
							rules={[
								{
									required: true,
									message:
										"Please input staff mobile number!",
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
							<Modal.Footer style={{ marginBottom: "-30px" }}>
								<Button
									variant="danger"
									onClick={onCloseHandler}
								>
									Close
								</Button>

								<Button
									variant="success"
									size="large"
									type="submit"
									className="login-form-button"
								>
									Update Supplier
								</Button>
							</Modal.Footer>
						</Form.Item>
					</Form>
				</CardTable>
			</Modal.Body>
		</Modal>
	);
};

export default UpdateStaff;
