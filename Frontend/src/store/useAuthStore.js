import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
	authUser: null,
	isCheckingAuth: true,
	isSigningUp: false,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth-check");
			set({ authUser: res.data }); //take note
		}
		catch (error) {
			console.log("Error in authCheck:", error);
			set({ authUser: null });
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
	}
}
));

/* {name: "john", _id: 123, age: 25},
	isLoggedIn: false,
	login: () => {
		console.log("We just logged in.");
		set({isLoggedIn: true});*/ //take note wtf is this? Apparently stores states that if needed can be accessed globally on any scripts without having the hassle to pass them individually to each function, idk still not clear enough
