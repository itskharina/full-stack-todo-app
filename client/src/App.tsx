import './styles/App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

function App() {
	return (
		<>
			<Sidebar />
			<Outlet />
		</>
	);
}
export default App;
