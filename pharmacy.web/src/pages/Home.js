import { Button, Layout, Space } from "antd";
import "./Home.css";
import NavbarSider from "../components/Navigation/Navigation";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ManageDrugs from "../components/Drugs/ManageDrugs";
import ManageSupplier from "../components/Supplier/ManageSupplier";
import AddSupplier from "../components/Supplier/AddSupplier";
import AddDrug from "../components/Drugs/AddDrug";
import AddStock from "../components/Stock/AddStock";
import ManageStock from "../components/Stock/ManageStock";
import AddStaff from "../components/Staff/AddStaff";
import ManageStaff from "../components/Staff/ManageStaff";
import Dashboard from "../components/Dashboard/Dashboard";
import AddInvoice from "../components/Invoice/AddInvoice";
import ManageInvoices from "../components/Invoice/ManageInvoices";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
import Setting from "../components/Setting/Setting";
const { Header, Content, Footer } = Layout;

const Home = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const logoutHandler = async () => {
		await axios.get("/api/v1/auth/logout");
		dispatch(authActions.logout());
		navigate("/");
	};
	return (
		<Layout
			style={{
				minHeight: "100vh",
			}}
		>
			<NavbarSider />
			<Layout className="site-layout">
				<Header className="site-layout-background">
					<Space
						style={{
							display: "flex",
							justifyContent: "end",
							alignItems: "center",
							marginRight: "1rem",
						}}
					>
						<Button onClick={logoutHandler}>Logout</Button>
					</Space>
				</Header>
				<Content
					style={{
						margin: "0 16px",
					}}
				>
					<Routes>
						<Route
							path="/"
							element={<Navigate to="/dashboard" replace />}
						/>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/addInvoice" element={<AddInvoice />} />
						<Route
							path="/manageInvoice"
							element={<ManageInvoices />}
						/>
						<Route path="/manageDrugs" element={<ManageDrugs />} />
						<Route path="/addDrugs" element={<AddDrug />} />
						<Route path="/addSupplier" element={<AddSupplier />} />
						<Route
							path="/manageSupplier"
							element={<ManageSupplier />}
						/>
						<Route path="/addStock" element={<AddStock />} />
						<Route path="/manageStock" element={<ManageStock />} />
						<Route path="/addStaff" element={<AddStaff />} />
						<Route path="/manageStaff" element={<ManageStaff />} />
						<Route path="/setting" element={<Setting />} />
						<Route
							path="/*"
							element={<Navigate to="/dashboard" replace />}
						/>
					</Routes>
				</Content>
				<Footer
					style={{
						textAlign: "center",
					}}
				>
					Pharmacy Management System ©2022 all rights resevred.
				</Footer>
			</Layout>
		</Layout>
	);
};

export default Home;
