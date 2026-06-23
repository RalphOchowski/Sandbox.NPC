import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isCheckingAuth: true,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	socket: null,
	onlineUsers: [],

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/auth-check");
			set({ authUser: res.data }); //take note
			get().connectSocket();
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
			const res = await axiosInstance.post("/auth/signup", data); //take note, is this where the frontend actually makes the request to the backend using the endpoint I wrote?
			set({ authUser: res.data });
			toast.success("Account created successfully!");
			get().connectSocket();
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
			const res = await axiosInstance.post("/auth/login", data); //take note
			set({ authUser: res.data });
			toast.success("Logged in successfully.");
			get().connectSocket();

			const chatStore = useChatStore.getState();
            chatStore.setSelectedUser(null);
            chatStore.set({ messages: [] });
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
			await axiosInstance.post("/auth/logout"); //take note, is this where the frontend actually makes the request to the backend using the endpoint I wrote?
			set({ authUser: null }); /*take note, if authUser is null, the router redirects user back to login as specified in app.jsx */
			toast.success("Logged out successfully.");
			get().disconnectSocket();

			const chatStore = useChatStore.getState();
            chatStore.setSelectedUser(null);
		}
		catch (error) {
			toast.error(error.response.data.message);
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true })
		try {
			const res = await axiosInstance.put("/auth/update-profile", data);
			set({ authUser: res.data }); //take note
			toast.success("Profile updated successfully.");
		}
		catch (error) {
			console.log("Error while updating profile: ", error);
			toast.error(error.response.data.message);
		}
		finally {
			set({ isUpdatingProfile: false })
		}
	},

	connectSocket: () => {
		const authUser = get();
		if (!authUser || get.socket?.connected) return; //take note
		const socket = io(BASE_URL,
			{ withCredentials: true }); //ensures cookies are sent with the connection
		socket.connect();
		set({ socket });

		//listen for events from online users
		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds })
		}); //take note
	},

	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	}
}
));

/* {name: "john", _id: 123, age: 25},
	isLoggedIn: false,
	login: () => {
		console.log("We just logged in.");
		set({isLoggedIn: true});*/ //take note wtf is this? Apparently stores states that if needed can be accessed globally on any scripts without having the hassle to pass them individually to each function, idk still not clear enough
