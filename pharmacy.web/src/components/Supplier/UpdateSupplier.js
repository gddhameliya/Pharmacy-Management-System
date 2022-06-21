import { Modal, Button } from "react-bootstrap";
import { Form, Input, Modal as AntdModal } from "antd";
import axios from "axios";
import CardTable from "../UI/CardTable";

const UpdateSuppliers = (props) => {
	const onFinish = async (values) => {
		try {
			await axios.patch(
				`/api/v1/users/${props.supplierDetails.id}`,
				values
			);
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
				<Modal.Title>Update Supplier</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<CardTable>
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{
							name: props.supplierDetails.name,
							email: props.supplierDetails.email,
							mobile: props.supplierDetails.mobile,
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
									message:
										"Please input suppier mobile number!",
								},
							]}
						>
							<Input
								size="large"
								type="tel"
								maxLength="10"
								pattern="[0-9]{10}"
								addonBefore="Supplier Mobile"
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

export default UpdateSuppliers;
