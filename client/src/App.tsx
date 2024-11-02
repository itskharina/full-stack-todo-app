import './styles/App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
// import { useEffect } from 'react';
// import tokenService from './services/token.js';

function App() {
	// useEffect(() => {
	// 	const loggedUserJSON = window.localStorage.getItem('loggedTodoappUser');
	// 	if (loggedUserJSON) {
	// 		const user = JSON.parse(loggedUserJSON);
	// 		tokenService.setToken(user.token);
	// 	}
	// }, []);

	// Check if user is authenticated
	const isAuthenticated = localStorage.getItem('token');

	// If not authenticated, redirect to login page
	if (!isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	// If authenticated, show the main app layout
	return (
		<>
			<Sidebar />
			<Outlet />
		</>
	);
}

export default App;
