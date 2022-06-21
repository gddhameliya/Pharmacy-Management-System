import { Button } from "react-bootstrap";
import { DatePicker, Form, Input, Modal, Select, Space } from "antd";
import axios from "axios";
import CardTable from "../UI/CardTable";
import moment from "moment";

const UpdateStock = (props) => {
	const onFinish = async (values) => {
		// console.log(values);
		try {
			await axios.patch(
				`/api/v1/stocks/${props.stockDetails.id}`,
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
			title="Update Stock"
			centered
			visible={props.show}
			footer={[]}
			onCancel={props.onClose}
			width={1000}
		>
			<CardTable>
				<Form
					name="normal_login"
					className="login-form"
					initialValues={{
						product: props.stockDetails.productId,
						batch: props.stockDetails.batch,
						mfgDate: moment(
							props.stockDetails.mfgDate,
							"YYYY-MM-DD"
						),
						expDate: moment(
							props.stockDetails.expDate,
							"YYYY-MM-DD"
						),
						quantity: props.stockDetails.quantity,
					}}
					onFinish={onFinish}
				>
					<Form.Item name="product">
						<Select
							showSearch
							placeholder="Select Drug"
							optionFilterProp="children"
							options={props.productsOptions}
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
								message:
									"Please select drug's manufacturing date!",
							},
						]}
					>
						<DatePicker
							format="YYYY-MM-DD"
							size="large"
							placeholder="Drug MFG Date"
						/>
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
						<DatePicker
							format="YYYY-MM-DD"
							size="large"
							placeholder="Drug EXP Date"
						/>
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
								Update Stock
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</CardTable>
		</Modal>
	);
};

export default UpdateStock;
