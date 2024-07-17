import * as FaIcons from 'react-icons/fa';
import { GoPlus } from 'react-icons/go';

export const SidebarData = [
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
