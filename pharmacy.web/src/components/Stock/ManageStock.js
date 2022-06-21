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
import UpdateStock from "./UpdateStock";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const ManageStock = () => {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [productOptions, setProductOptions] = useState([]);
	const getData = async () => {
		try {
			let stockDataFormated = [];
			const stockData = await axios.get("/api/v1/stocks");
			stockData.data.stocks.forEach((stock) => {
				let mfgDate = new Date(stock.mfgDate);

				mfgDate = `${mfgDate.getFullYear()}-${
					mfgDate.getMonth() < 9
						? "0" + (mfgDate.getMonth() + 1)
						: mfgDate.getMonth() + 1
				}-${
					mfgDate.getDate().toString().length === 1
						? "0" + mfgDate.getDate().toString()
						: mfgDate.getDate()
				}`;

				let expDate = new Date(stock.expDate);
				expDate = `${expDate.getFullYear()}-${
					expDate.getMonth() < 9
						? "0" + (expDate.getMonth() + 1)
						: expDate.getMonth() + 1
				}-${
					expDate.getDate().toString().length === 1
						? "0" + expDate.getDate().toString()
						: expDate.getDate()
				}`;
				stockDataFormated.push({
					...stock,
					mfgDate,
					expDate,
				});
			});
			setData([...stockDataFormated]);
		} catch (error) {
			console.log(error);
		}
	};
	const getProducts = async () => {
		try {
			const {
				data: { products },
			} = await axios.get("/api/v1/products");
			const options = [];
			products.map((product) =>
				options.push({
					label: product.name,
					value: product._id,
				})
			);
			setProductOptions([...options]);
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "There is an error while fetching products.",
			});
		}
	};
	useEffect(() => {
		getProducts();
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

	const [showStockUpdateForm, setShowStockUpdateForm] = useState(false);
	const [stockDetails, setStockDetails] = useState({
		id: "",
		product: { productName: "", productId: "" },
		batch: "",
		expDate: "",
		mfgDate: "",
		quantity: 0,
	});
	const deleteStockHandler = async (stockId) => {
		try {
			await axios.delete(`/api/v1/stocks/${stockId}`);
			getData();
		} catch (error) {
			Modal.error({
				title: "Error",
				content: "Operation failed.",
			});
		}
	};
	const editStockHandler = async (stockId) => {
		const responseData = await axios.get(`/api/v1/stocks/${stockId}`);
		// console.log(responseData.data);
		const {
			_id: id,
			product: { name: productName, _id: productId },
			batch,
			expDate,
			mfgDate,
			quantity,
		} = responseData.data.stock;
		setStockDetails({
			id,
			productName,
			productId,
			batch,
			expDate,
			mfgDate,
			quantity,
		});
		setShowStockUpdateForm(true);
	};
	const closeModalHandler = () => {
		getData();
		setShowStockUpdateForm(false);
	};
	const clearFilerHandler = () => {
		navigate(0);
	};
	const columns = [
		{
			title: "Product",
			dataIndex: ["product", "name"],
			key: ["product", "name"],
			width: "30%",
			...getColumnSearchProps(["product", "name"]),
		},
		{
			title: "Batch",
			dataIndex: "batch",
			key: "batch",
			width: "25%",
			...getColumnSearchProps("batch"),
		},
		{
			title: "MFG Date",
			dataIndex: "mfgDate",
			key: "mfgDate",
			width: "25%",
			...getColumnSearchProps("mfgDate"),
		},
		{
			title: "EXP Date",
			dataIndex: "expDate",
			key: "expDate",
			width: "25%",
			sorter: (a, b) => a.expDate - b.expDate,
		},
		{
			title: "Quantity",
			dataIndex: "quantity",
			key: "quantity",
			sorter: (a, b) => a.totalQuantity - b.totalQuantity,
		},
		{
			title: "Price",
			dataIndex: ["product", "price"],
			key: ["product", "price"],
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
						onClick={() => editStockHandler(record._id)}
					/>
					<Popconfirm
						placement="leftBottom"
						title={"Are you sure?"}
						onConfirm={() => deleteStockHandler(record._id)}
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
			<UpdateStock
				key={stockDetails.id}
				productsOptions={productOptions}
				stockDetails={stockDetails}
				show={showStockUpdateForm}
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

export default ManageStock;
