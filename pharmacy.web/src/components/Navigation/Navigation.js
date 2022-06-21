import React, { useState } from "react";
import { Menu, Typography, Layout } from "antd";
import {
	DashboardOutlined,
	MedicineBoxOutlined,
	PlusSquareOutlined,
	OrderedListOutlined,
	PrinterOutlined,
	InboxOutlined,
	UserAddOutlined,
	UsergroupAddOutlined,
	SettingOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../../store/auth";

const { Title } = Typography;
const { Sider } = Layout;

const NavbarSider = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getItem = (label, key, icon, path, children) => {
		if (!children)
			label = (
				<ul>
					<li
						onClick={async () => {
							if (path === "/logout") {
								await axios.get("/api/v1/auth/logout");
								dispatch(authActions.logout());
								navigate("/");
							} else navigate(path);
						}}
						style={{ listStyle: "none" }}
					>
						{label}
					</li>
				</ul>
			);
		else label = <span style={{ listStyle: "none" }}>{label}</span>;
		return {
			key,
			icon,
			children,
			label,
		};
	};
	const [state, setState] = useState(false);

	const items = [
		getItem("Dashboard", "0", <DashboardOutlined />, "/dashboard"),
		getItem("Invoice", "1", <PrinterOutlined />, "/manageInvoice", [
			getItem(
				"Add Invoice",
				"1.1",
				<PlusSquareOutlined />,
				"/addInvoice"
			),
			getItem(
				"Manage Invoice",
				"1.2",
				<OrderedListOutlined />,
				"/manageInvoice"
			),
		]),
		getItem("Drugs", "2", <MedicineBoxOutlined />, "/manageDrugs", [
			getItem("Add Drugs", "2.1", <PlusSquareOutlined />, "/addDrugs"),
			getItem(
				"Manage Drugs",
				"2.2",
				<OrderedListOutlined />,
				"/manageDrugs"
			),
		]),
		getItem("Stock", "3", <InboxOutlined />, "/manageStock", [
			getItem("Add Stock", "3.1", <PlusSquareOutlined />, "/addStock"),
			getItem(
				"Manage Stock",
				"3.2",
				<OrderedListOutlined />,
				"/manageStock"
			),
		]),
		getItem("Supplier", "4", <UserAddOutlined />, "/manageSupplier", [
			getItem(
				"Add Supplier",
				"4.1",
				<PlusSquareOutlined />,
				"/addSupplier"
			),
			getItem(
				"Manage Supplier",
				"4.2",
				<OrderedListOutlined />,
				"/manageSupplier"
			),
		]),
		getItem("Staff", "5", <UsergroupAddOutlined />, "/manageStaff", [
			getItem("Add Staff", "5.1", <PlusSquareOutlined />, "/addStaff"),
			getItem(
				"Manage Staff",
				"5.2",
				<OrderedListOutlined />,
				"/manageStaff"
			),
		]),
		getItem("Setting", "6", <SettingOutlined />, "/setting"),
		getItem("Logout", "7", <LogoutOutlined />, "/logout"),
	];
	return (
		<Sider
			collapsible
			collapsed={state}
			onCollapse={() => setState((prev) => !prev)}
			style={{
				background: "#fff",
				overflow: "auto",
				minHeight: "100vh",
				left: 0,
				top: 0,
				bottom: 0,
				boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
			}}
		>
			<Title
				level={!state ? 1 : 3}
				style={{
					textAlign: "center",
					paddingTop: "1rem",
					color: "#25659f",
				}}
			>
				PMS
			</Title>
			<Menu style={{ background: "#fff" }} mode="inline" items={items} />
		</Sider>
	);
};

export default NavbarSider;
