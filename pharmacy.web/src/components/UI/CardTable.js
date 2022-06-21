import { Row, Col } from "antd";

const CardTable = (props) => {
	return (
		<Row justify="center" align="middle" style={{ marginTop: "1rem" }}>
			<Col span={24}>{props.children}</Col>
		</Row>
	);
};

export default CardTable;
