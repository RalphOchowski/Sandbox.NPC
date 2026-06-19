import { create } from "zustand";

export const useAuthStore = create( (set) => ({
	authUser: {name: "john", _id: 123, age: 25},
	isLoggedIn: false,
	login: () => {
		console.log("We just logged in.");
		set({isLoggedIn: true});
	}
})); //take note wtf is this? Apparently stores states can be used globally on any scripts without having the hassle to pass them individually to each function, idk still not clear enough

