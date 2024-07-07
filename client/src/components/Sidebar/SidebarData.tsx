import * as FaIcons from 'react-icons/fa';

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
				title: 'Work',
				path: '/work',
				icon: <FaIcons.FaClipboardList />,
				cName: 'nav-text',
			},
		],
	},
];
