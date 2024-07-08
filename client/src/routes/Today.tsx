import { useSidebar } from '../components/Sidebar/SidebarContext';

const Today = () => {
	const { sidebar } = useSidebar();

	return (
		<div className={`today ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>Today</h1>
		</div>
	);
};

export default Today;
