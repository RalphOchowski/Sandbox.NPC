import axios from "axios";

/*Take note on what axios is all about and it's native alternative the fetch API */

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api/auth/" : "https://realtime-chat-application-9-tfrq.onrender.com/api",
	withCredentials: true
}); //take note