import { Button } from "react-bootstrap";
import { Form, Input, Modal, Select, Space } from "antd";
import axios from "axios";
import CardTable from "../UI/CardTable";

const UpdateDrug = (props) => {
	console.log(props.drugDetails);
	const onFinish = async (values) => {
		// console.log(values);
		try {
			await axios.patch(
				`/api/v1/products/${props.drugDetails.id}`,
				values
			);
			props.onClose();
		} catch (error) {
			props.onClose();
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
	const onCloseHandler = () => {
		props.onClose();
	};
	return (
		<Modal
			key={props.drugDetails.id}
			title="Update Drug"
			centered
			visible={props.show}
			footer={[]}
			onCancel={props.onClose}
			width={1000}
		>
			<CardTable>
				<Form
					key={props.drugDetails.id}
					name="normal_login"
					className="login-form"
					initialValues={{
						name: props.drugDetails.name,
						genericName: props.drugDetails.genericName,
						price: props.drugDetails.price,
						supplier: props.drugDetails.supplierId,
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
							options={props.suppliersOptions}
							filterOption={(input, option) =>
								option.label
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}
						></Select>
					</Form.Item>

					<Form.Item>
						<Space
							style={{ display: "flex", justifyContent: "end" }}
						>
							<Button variant="danger" onClick={onCloseHandler}>
								Close
							</Button>
							<Button
								variant="success"
								size="large"
								type="submit"
								className="login-form-button"
							>
								Update Drug
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</CardTable>
		</Modal>
	);
};

export default UpdateDrug;
