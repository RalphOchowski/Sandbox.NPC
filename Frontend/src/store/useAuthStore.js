import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
	authUser: null,
	isCheckingAuth: true,
	isSigningUp: false,
	isLoggingIn: false,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth-check");
			set({ authUser: res.data }); //take note
		}
		catch (error) {
			console.log("Error in authCheck:", error);
			set({ authUser: null }); //take note
		}
		finally {
			set({ isCheckingAuth: false });
		} //take note
	},

	signup: async (data) => {
		set({ isSigningUp: true })
		try {
			const res = await axiosInstance.post("/signup", data); //take note, is this where the frontend actually makes the request to the backend using the endpoint I wrote?
			set({ authUser: res.data });
			toast.success("Account created successfully!");
		}
		catch (error) {
			toast.error(error.response.data.message);
		}
		finally {
			set({ isSigningUp: false })
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true })
		try {
			const res = await axiosInstance.post("/login", data); //take note
			set({ authUser: res.data });
			toast.success("Logged in successfully.");
		}
		catch (error) {
			toast.error(error.response.data.message);
		}
		finally {
			set({ isLoggingIn: false })
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/logout"); //take note, is this where the frontend actually makes the request to the backend using the endpoint I wrote?
			set({ authUser: null }); /*take note, if authUser is null, the router redirects user back to login as specified in app.jsx */
			toast.success("Logged out successfully.");
		}
		catch (error) {
			toast.error(error.response.data.message);
		}
}}
));

/* {name: "john", _id: 123, age: 25},
	isLoggedIn: false,
	login: () => {
		console.log("We just logged in.");
		set({isLoggedIn: true});*/ //take note wtf is this? Apparently stores states that if needed can be accessed globally on any scripts without having the hassle to pass them individually to each function, idk still not clear enough
