import { Col, Row } from "antd";
import CardTable from "../UI/CardTable";
// import InvoiceInfo from "./InvoiceInfo";
import InvoiceTable from "./InvoiceTable";
const AddInvoice = () => {
	return (
		<CardTable>
			<Row span={24}>{/* <InvoiceInfo /> */}</Row>
			<Col span={24}>
				<InvoiceTable />
			</Col>
		</CardTable>
	);
};

export default AddInvoice;
