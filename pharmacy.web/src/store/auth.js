import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
	isLoggedIn: false,
	role: "",
	name: "",
	userId: "",
};
const authSlice = createSlice({
	name: "auth",
	initialState: initialAuthState,
	reducers: {
		login(state, data) {
			state.isLoggedIn = true;
			state.role = data.payload.role;
			state.name = data.payload.name;
			state.userId = data.payload.userId;
		},
		logout(state) {
			state.isLoggedIn = false;
			state.role = "";
			state.userName = "";
			state.userID = "";
		},
	},
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
