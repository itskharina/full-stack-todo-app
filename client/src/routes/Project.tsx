import { useParams } from 'react-router-dom';
import projectService from '../services/project.js';
import { useEffect, useState } from 'react';
import { useSidebar } from '../components/Sidebar/SidebarProvider';

import redFlag from '../assets/redflag.png';
import orangeFlag from '../assets/orangeflag.png';
import greenFlag from '../assets/greenflag.png';
import greyFlag from '../assets/greyflag.png';
import { ITodo } from '../store/todoSlice.js';
import TodoList from '../components/Accordion.js';
import tokenService from '../services/token.js';

// Fetches and displays all todos associated with a specific project.
const Project = () => {
	const { sidebar } = useSidebar();

	const { projectName } = useParams(); // Retrieve the project name from the URL.

	// State to store the project data, including project id, name, and todos.
	const [project, setProject] = useState<{
		id: string;
		name: string;
		todos: ITodo[];
	} | null>(null);

	// Effect to set authentication token if a user is logged in
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedTodoappUser');
		if (loggedUserJSON) {
			// Parse the user data from local storage.
			const user = JSON.parse(loggedUserJSON);
			// Set the user's token for API requests
			tokenService.setToken(user.token);
		}
	}, []);

	// Effect to fetch project data when the projectName changes
	useEffect(() => {
		const fetchProject = async () => {
			if (projectName) {
				// Fetch project details
				const project = await projectService.getProjectByName(projectName);
				// Update the state with the fetched project
				setProject(project);
			}
		};
		fetchProject();
	}, [projectName]);

	// Render nothing if the project data hasn't been fetched or is invalid.
	if (!project) {
		return null;
	}

	// Mapping of priority levels to flag images for each todo item.
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

	// Render the project details and todos
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
