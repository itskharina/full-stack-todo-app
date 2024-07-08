import { useSidebar } from '../components/Sidebar/SidebarContext';

const Week = () => {
	const { sidebar } = useSidebar();

	return (
		<div className={`week ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>Week</h1>
		</div>
	);
};

export default Week;
