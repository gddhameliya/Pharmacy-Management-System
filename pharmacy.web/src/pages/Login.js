import { Row, Col } from "antd";
import { Layout } from "antd";
import LoginForm from "../components/Login/LoginForm";
import { Typography } from "antd";
import logo from "../assets/logo.png";
const { Footer, Content } = Layout;
const { Title } = Typography;

const Login = () => {
	return (
		<>
			<Layout style={{ minHeight: "100vh" }}>
				<Content>
					<Row
						align="middle"
						style={{
							minHeight: "90vh",
						}}
					>
						<Col align="middle" span={9} offset={1}>
							<Title
								style={{
									color: "#1483AF",
									fontWeight: "bolder",
								}}
							>
								Pharmacy Management System
							</Title>
							<img
								src={logo}
								alt="Logo"
								style={{ width: "80%" }}
							/>
						</Col>
						<Col span={10} offset={2}>
							<LoginForm />
						</Col>
					</Row>
				</Content>
				<Footer style={{ textAlign: "center" }}>
					Pharmacy Management System ©2022 all rights resevred.
				</Footer>
			</Layout>
		</>
	);
};

export default Login;
