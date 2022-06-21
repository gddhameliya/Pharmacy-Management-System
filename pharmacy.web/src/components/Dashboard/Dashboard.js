import {
	InboxOutlined,
	MedicineBoxTwoTone,
	PrinterTwoTone,
	UserOutlined,
} from "@ant-design/icons";

import { Col, Row } from "antd";
import CardDashboard from "../UI/CardDashboard";
const Dashboard = () => {
	return (
		<Row>
			{/* <Title level={3} style={{ marginTop: "2rem" }}>
				Add New Ones
			</Title> */}
			<Row
				gutter={[48, 48]}
				style={{
					marginTop: "2rem",
					marginRight: "-1rem",
				}}
			>
				<Col lg={6} md={12} sm={12}>
					<CardDashboard path="/addInvoice" title="Generate Invoice">
						<PrinterTwoTone
							style={{ float: "left", fontSize: "2rem" }}
						/>
					</CardDashboard>
				</Col>
				<Col lg={6} md={12} sm={12}>
					<CardDashboard path="/manageDrugs" title="Manage Drug">
						<MedicineBoxTwoTone
							style={{ float: "left", fontSize: "2rem" }}
						/>
					</CardDashboard>
				</Col>
				<Col lg={6} md={12} sm={12}>
					<CardDashboard path="/manageStock" title="Manage Stock">
						<InboxOutlined
							style={{ float: "left", fontSize: "2rem" }}
						/>
					</CardDashboard>
				</Col>

				<Col lg={6} md={12} sm={12}>
					<CardDashboard
						path="/manageSupplier"
						title="Manage Supplier"
					>
						<UserOutlined
							style={{ float: "left", fontSize: "2rem" }}
						/>
					</CardDashboard>
				</Col>
				<Col lg={6} md={12} sm={12}>
					<CardDashboard path="/manageStaff" title="Manage Staff">
						<UserOutlined
							style={{ float: "left", fontSize: "2rem" }}
						/>
					</CardDashboard>
				</Col>
			</Row>
		</Row>
	);
};
export default Dashboard;
