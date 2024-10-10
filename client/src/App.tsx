import './styles/App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import Login from './routes/Login';
// import Signup from './routes/Signup';
import './styles/LoginContainer.scss';

function App() {
	return (
		<>
			<Sidebar />
			<Outlet />
			{!localStorage.getItem('token') && (
				<div className='login-container'>
					<Login />
					<p className='sign-up-option'>
						Don't have an account? <a href='/signup'>Sign up</a>
					</p>
				</div>
			)}
		</>
	);
}
export default App;
