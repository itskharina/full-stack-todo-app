import { useEffect } from 'react';
import todoService from '../services/todos';
import { setTodos } from '../store/todoSlice';
import { useSidebar } from '../components/Sidebar/SidebarProvider';
import { useAppSelector, useAppDispatch } from '../hooks';
import TodoList from '../components/Accordion';
import redFlag from '../assets/redflag.png';
import orangeFlag from '../assets/orangeflag.png';
import greenFlag from '../assets/greenflag.png';
import greyFlag from '../assets/greyflag.png';
import tokenService from '../services/token.js';

// Displays all of the user's todos
const Upcoming = () => {
	const { sidebar } = useSidebar();
	const dispatch = useAppDispatch();

	// Check for existing user session and restore authentication token
	// This ensures API calls remain authenticated after page refreshes
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedTodoappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			tokenService.setToken(user.token);
		}
	}, []);

	// Fetch all todos from the backend and update the Redux store
	// This effect runs once when the component mount
	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const fetchedTodos = await todoService.getTodos();
				dispatch(setTodos(fetchedTodos));
			} catch (error) {
				console.error('Error fetching todos:', error);
			}
		};
		fetchTodos();
	}, [dispatch]);

	// Selector to retrieve todos from the Redux store.
	const todos = useAppSelector((state) => state.todo);

	// Object mapping priority levels to their corresponding flag images
	// Used to display visual indicators of todo priority
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

	// Render the upcoming todos with the project name and a counter of total todos
	return (
		// Adds padding transition if sidebar is open
		<div className={`upcoming ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>
				Upcoming <span className='todos-length'>{todos.length}</span>
			</h1>
			<TodoList todos={todos} priorityImages={priorityImages} />
		</div>
	);
};

export default Upcoming;
