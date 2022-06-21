import { Row, Col, Card, Typography } from "antd";
const { Title } = Typography;

const CardForm = (props) => {
	return (
		<Row justify="center" align="middle" style={{ minHeight: "75vh" }}>
			<Col span={18}>
				<Card title={<Title level={4}>{props.title}</Title>}>
					{props.children}
				</Card>
			</Col>
		</Row>
	);
};

export default CardForm;
