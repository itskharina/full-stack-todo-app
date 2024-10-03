import './styles/App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
// import Login from './routes/Login';
// import Signup from './routes/Signup';
import './styles/LoginContainer.scss';

function App() {
	return (
		<>
			{/* <Login /> */}
			{/* <Signup /> */}
			<Sidebar />
			<Outlet />
		</>
	);
}
export default App;
