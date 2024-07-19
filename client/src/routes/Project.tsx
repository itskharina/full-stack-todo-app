import { useParams } from 'react-router-dom';
import projectService from '../services/project.js';
import { useEffect, useState } from 'react';
import { useSidebar } from '../components/Sidebar/SidebarProvider';

import redFlag from '../assets/redflag.png';
import orangeFlag from '../assets/orangeflag.png';
import greenFlag from '../assets/greenflag.png';
import greyFlag from '../assets/greyflag.png';

import TodoList from '../components/Accordion.js';

interface ITodo {
	title: string;
	todo: string;
	dueDate?: Date;
	priority: 'none' | 'high' | 'medium' | 'low';
	project: string | null;
}

const Project = () => {
	const { sidebar } = useSidebar();

	const { projectName } = useParams();

	const [project, setProject] = useState<{
		name: string;
		todos: ITodo[];
	} | null>(null);

	useEffect(() => {
		const fetchProject = async () => {
			if (projectName) {
				const project = await projectService.getProjectByName(projectName);
				setProject(project);
			}
		};
		fetchProject();
	}, [projectName]);

	if (!project) {
		return <div>Loading...</div>;
	}

	const priorityImages: {
		high: string;
		medium: string;
		low: string;
		none: string;
		[key: string]: string;
	} = {
		high: redFlag,
		medium: orangeFlag,
		low: greenFlag,
		none: greyFlag,
	};

	return (
		<div className={`project ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>
				{project.name} <span className='todos-length'>{project.todos.length}</span>
			</h1>
			<ul>
				<TodoList todos={project.todos} priorityImages={priorityImages} />
			</ul>
		</div>
	);
};

export default Project;
