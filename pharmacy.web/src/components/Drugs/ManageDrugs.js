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
import UpdateDrug from "./UpdateDrug";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
const ManageDrugs = () => {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [suppliersOptions, setSupplierOptions] = useState([]);
	const getData = async () => {
		try {
			const drugData = await axios.get("/api/v1/products");
			setData([...drugData.data.products]);
		} catch (error) {
			console.log(error);
		}
	};
	const getSuppliers = async () => {
		try {
			const {
				data: { suppliers },
			} = await axios.get("/api/v1/suppliers");
			const options = [];
			suppliers.map((supplier) =>
				options.push({
					label: supplier.name,
					value: supplier._id,
				})
			);
			setSupplierOptions([...options]);
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "There is an error while fetching suppliers.",
			});
		}
	};
	useEffect(() => {
		getSuppliers();
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
			_.get(record, dataIndex)
				? _.get(record, dataIndex)
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: "",
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current.select(), 100);
			}
		},
		render: (text) =>
			_.isEqual(searchedColumn, dataIndex) ? (
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

	const [showDrugUpdateForm, setShowDrugUpdateForm] = useState(false);
	const [drugDetails, setDrugDetails] = useState({
		id: "",
		name: "",
		genericName: "",
		price: 0,
		totalQuantity: 0,
		supplier: { supplierName: "", supplierId: "" },
	});
	const deleteDrugHandler = async (drugId) => {
		try {
			await axios.delete(`/api/v1/products/${drugId}`);
			getData();
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "Operation failed.",
			});
		}
	};
	const editDrugHandler = async (drugId) => {
		const responseData = await axios.get(`/api/v1/products/${drugId}`);
		// console.log(responseData.data);
		const {
			_id: id,
			name,
			genericName,
			price,
			totalQuantity,
			supplier: { name: supplierName, _id: supplierId },
		} = responseData.data.product;
		setDrugDetails({
			id,
			name,
			genericName,
			price,
			totalQuantity,
			supplierName,
			supplierId,
		});
		setShowDrugUpdateForm(true);
	};
	const closeModalHandler = () => {
		getData();
		setShowDrugUpdateForm(false);
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
			title: "Generic Name",
			dataIndex: "genericName",
			key: "genericName",
			width: "30%",
			...getColumnSearchProps("genericName"),
		},
		{
			title: "Supplier",
			dataIndex: ["supplier", "name"],
			key: ["supplier", "name"],
			width: "30%",
			...getColumnSearchProps(["supplier", "name"]),
		},
		{
			title: "Total Quantity",
			dataIndex: "totalQuantity",
			key: "totalQuantity",
			sorter: (a, b) => a.totalQuantity - b.totalQuantity,
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			width: "20%",
			sorter: (a, b) => a.price - b.price,
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
						onClick={() => editDrugHandler(record._id)}
					/>
					<Popconfirm
						placement="leftBottom"
						title={"Are you sure?"}
						onConfirm={() => deleteDrugHandler(record._id)}
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
			<UpdateDrug
				key={drugDetails.id}
				suppliersOptions={suppliersOptions}
				drugDetails={drugDetails}
				show={showDrugUpdateForm}
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

export default ManageDrugs;
