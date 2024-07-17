import * as FaIcons from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

interface SidebarItem {
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
				path: '/',
				icon: <FaIcons.FaInbox />,
				cName: 'nav-text',
			},
			{
				title: 'Today',
				path: '/today',
				icon: <FaIcons.FaCalendarDay />,
				cName: 'nav-text',
			},
			{
				title: 'This Week',
				path: '/week',
				icon: <FaIcons.FaCalendarWeek />,
				cName: 'nav-text',
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
			},
		],
	},
];
