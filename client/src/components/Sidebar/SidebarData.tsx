import * as FaIcons from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

// Interface for individual sidebar navigation items
interface SidebarItem {
	id: string;
	title: string;
	path?: string;
	icon: React.ReactElement;
	cName: string;
}

// Interface for sidebar categories (Tasks and Projects)
interface SidebarCategory {
	title: string;
	cName: string;
	items: SidebarItem[];
}

// Default sidebar navigation structure
// Contains two main categories: Tasks and Projects
export const SidebarData: SidebarCategory[] = [
	{
		title: 'Tasks',
		cName: 'tasks-title',
		items: [
			// Default tasks
			{
				title: 'Upcoming',
				path: '/upcoming',
				icon: <FaIcons.FaInbox />,
				cName: 'nav-text',
				id: 'main-tasks',
			},
			{
				title: 'Today',
				path: '/today',
				icon: <FaIcons.FaCalendarDay />,
				cName: 'nav-text',
				id: 'main-tasks',
			},
			{
				title: 'This Week',
				path: '/week',
				icon: <FaIcons.FaCalendarWeek />,
				cName: 'nav-text',
				id: 'main-tasks',
			},
		],
	},
	{
		title: 'Projects',
		cName: 'projects-title',
		items: [
			// Initial Projects section with only "Create new project" button
			// Additional projects are added dynamically
			{
				title: 'Create new project',
				cName: 'nav-text',
				icon: <GoPlus />,
				id: '',
			},
		],
	},
];
