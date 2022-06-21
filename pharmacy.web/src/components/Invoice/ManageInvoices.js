import { Table, Input, Button, Space, Modal, Col } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, SyncOutlined, PrinterFilled } from "@ant-design/icons";
import CardTable from "../UI/CardTable";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageInvoices = () => {
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	const getData = async () => {
		try {
			const invoicesData = await axios.get("/api/v1/invoices");
			let invoiceDataFormated = [];
			invoicesData.data.invoices.forEach((invoice) => {
				let date = new Date(invoice.date);

				date = `${date.getFullYear()}-${
					date.getMonth() < 9
						? "0" + (date.getMonth() + 1)
						: date.getMonth() + 1
				}-${
					date.getDate().toString().length === 1
						? "0" + date.getDate().toString()
						: date.getDate()
				}`;
				invoiceDataFormated.push({
					...invoice,
					date,
				});
			});
			setData([...invoiceDataFormated]);
		} catch (error) {
			console.log(error);
			if (error.response?.data?.msg) {
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
	const clearFilerHandler = () => {
		navigate(0);
	};

	const columns = [
		{
			title: "Customer Name",
			dataIndex: "customer",
			key: "customer",
			width: "30%",
			...getColumnSearchProps("customer"),
		},
		{
			title: "Invoice Date",
			dataIndex: "date",
			key: "date",
			width: "30%",
			...getColumnSearchProps("date"),
		},
		{
			title: "Total Amount",
			dataIndex: "grandTotal",
			key: "grandTotal",
			width: "40%",
			sorter: (a, b) => a.grandTotal - b.grandTotal,
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
					<PrinterFilled
						key={record._id}
						style={{ fontSize: "1.5rem" }}
						// onClick={() => editSupplierHandler(record._id)}
					/>
				</Space>
			),
		},
	];
	// console.log(data);
	return (
		<>
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

export default ManageInvoices;
