import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { authActions } from "./store/auth";

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLoggedIn } = useSelector((state) => state.auth);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const checkLoginStatus = async () => {
			try {
				const res = await axios.get("/api/v1/users/showMe");
				setIsLoading(false);
				dispatch(authActions.login(res.data.user));
			} catch (error) {
				navigate("/");
				setIsLoading(false);
			}
		};
		if (!isLoggedIn) checkLoginStatus();
	}, [dispatch, navigate, isLoggedIn]);
	return (
		<>
			{!isLoading && isLoggedIn && <Home />}
			{/* {!isLoading && !isLoggedIn && <Login />} */}
		</>
	);
}

export default App;
