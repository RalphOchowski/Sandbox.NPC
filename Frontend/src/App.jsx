/* take note, what is jsx and how is it different from js, what is tailwind-css and how is it different from any other kinds of css (as if I'm aware of any other than bootstrap lol) */
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { Navigate, Routes, Route } from "react-router";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader"; {/* take note, difference between named export and default, like this one? */}
import { Toaster } from "react-hot-toast";

{/* take note: line 10, the < /> containers, what does each imported function from react-router do here?*/}
function App() {
	const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
	
	useEffect(() => {
		checkAuth();
	}, [checkAuth]); {/* take note */}
	
	if(isCheckingAuth) return <PageLoader />
	return (
	<div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
	{/* Decorators - Grid BG & Glow Shapes */}
	<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
    <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
    <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
	<Routes>
	<Route path="/" element={ authUser ? <ChatPage /> : <Navigate to={ "/login" } /> } /> {/* take note, redirects user back to login page if they are not authenticated */}
	<Route path="/login" element={ !authUser ? <LoginPage/> : <Navigate to={ "/" } /> } /> {/* same drill as above except this time it redirects user to the chat page if authenticated */}
	<Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to={ "/" } /> } /> 
	</Routes>
	<Toaster />
	</div>
	); 
}; 
export default App;

{ /* const { authUser, isLoggedIn, login } = useAuthStore();
	
	console.log("auth user: ", authUser);
	console.log("isLoggedIn: ", isLoggedIn);
	take note, wtf did I just do here? */}