import './styles/App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function App() {
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
