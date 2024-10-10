import * as FaIcons from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

interface SidebarItem {
	id: string;
	title: string;
	path?: string;
	icon: React.ReactElement;
	cName: string;
}

interface SidebarCategory {
	title: string;
	cName: string;
	items: SidebarItem[];
}

export const SidebarData: SidebarCategory[] = [
	{
		title: 'Tasks',
		cName: 'tasks-title',
		items: [
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
			{
				title: 'Create new project',
				cName: 'nav-text',
				icon: <GoPlus />,
				id: '',
			},
		],
	},
];
