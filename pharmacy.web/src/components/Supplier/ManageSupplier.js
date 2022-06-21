import { Table, Input, Button, Space, Popconfirm, Modal, Col } from "antd";
import Highlighter from "react-highlight-words";
import {
	EditFilled,
	SearchOutlined,
	DeleteFilled,
	SyncOutlined,
} from "@ant-design/icons";
import CardTable from "../UI/CardTable";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import UpdateSupplier from "./UpdateSupplier";
import { useNavigate } from "react-router-dom";

const ManageSupplier = () => {
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	const getData = async () => {
		try {
			const supplierData = await axios.get("/api/v1/suppliers");
			setData([...supplierData.data.suppliers]);
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
	useEffect(() => {
		getData();
	}, []);
	const [searchCriteria, setSearchCriteria] = useState({
		searchText: "",
		searchedColumn: "",
	});

	const searchInput = useRef();

	const { searchText, searchedColumn } = searchCriteria;

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchCriteria({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchCriteria({ ...searchCriteria, searchText: "" });
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setSearchCriteria({
								searchText: selectedKeys[0],
								searchedColumn: dataIndex,
							});
						}}
					>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{ color: filtered ? "#1890ff" : undefined }}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: "",
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	const [showSupplierUpdateForm, setShowSupplierUpdateForm] = useState(false);
	const [supplierDetails, setSupplierDetails] = useState({
		id: "",
		name: "",
		email: "",
		mobile: "",
	});
	const deleteSupplierHandler = async (supplierId) => {
		try {
			await axios.delete(`/api/v1/suppliers/${supplierId}`);
			getData();
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "Operation failed.",
			});
		}
	};
	const editSupplierHandler = async (supplierId) => {
		const responseData = await axios.get(`/api/v1/suppliers/${supplierId}`);
		// console.log(responseData.data);
		const { name, email, mobile, _id: id } = responseData.data.supplier;
		setSupplierDetails({
			id,
			name,
			email,
			mobile,
		});
		setShowSupplierUpdateForm(true);
	};
	const closeModalHandler = () => {
		getData();
		setShowSupplierUpdateForm(false);
	};
	const clearFilerHandler = () => {
		navigate(0);
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			width: "30%",
			...getColumnSearchProps("name"),
		},
		{
			title: "Mobile Number",
			dataIndex: "mobile",
			key: "mobile",
			width: "30%",
			...getColumnSearchProps("mobile"),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: "40%",
			...getColumnSearchProps("email"),
		},
		{
			title: "Actions",
			dataIndex: "action",
			key: "action",
			render: (text, record) => (
				<Space
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					size="large"
				>
					<EditFilled
						key={record._id}
						style={{ fontSize: "1rem" }}
						onClick={() => editSupplierHandler(record._id)}
					/>
					<Popconfirm
						placement="leftBottom"
						title={"Are you sure?"}
						onConfirm={() => deleteSupplierHandler(record._id)}
						okText="Yes"
						cancelText="No"
					>
						<DeleteFilled style={{ fontSize: "1rem" }} />
					</Popconfirm>
				</Space>
			),
		},
	];
	// console.log(data);
	return (
		<>
			<UpdateSupplier
				supplierDetails={supplierDetails}
				show={showSupplierUpdateForm}
				onClose={closeModalHandler}
			/>
			<CardTable>
				<Col>
					<SyncOutlined
						onClick={clearFilerHandler}
						style={{
							fontSize: "2rem",
							margin: "0 1rem 1rem 0",
							display: "flex",
							justifyContent: "end",
						}}
					/>
				</Col>
				<Table
					columns={columns}
					dataSource={data.map((x, ind) => {
						return { ...x, key: ind };
					})}
				/>
			</CardTable>
		</>
	);
};

export default ManageSupplier;
