import { useNavigate } from "react-router-dom";
import { Card, Typography } from "antd";
const Title = Typography.Title;
const CardDashboard = (props) => {
	const navigate = useNavigate();

	return (
		<Card onClick={() => navigate(props.path)} className="dashboardCard">
			{props.children}
			<Title
				level={3}
				style={{ float: "right", color: "#00315f", margin: "0" }}
			>
				{props.title}
			</Title>
		</Card>
	);
};

export default CardDashboard;
