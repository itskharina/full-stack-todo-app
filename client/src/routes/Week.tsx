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
import { isThisWeek } from 'date-fns';
import { ITodo } from '../store/todoSlice';

const Week = () => {
	const { sidebar } = useSidebar();
	const dispatch = useAppDispatch();

	useEffect(() => {
		todoService.getTodos().then((notes) => {
			const weeklyNotes: ITodo[] = [];
			notes.forEach((note: ITodo) => {
				if (note.dueDate && isThisWeek(new Date(note.dueDate))) {
					weeklyNotes.push(note);
				}
			});
			dispatch(setTodos(weeklyNotes));
		});
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

	// Render the todos with the project name and a counter of total todos
	return (
		// Adds padding transition if sidebar is open
		<div className={`week ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>
				This Week <span className='todos-length'>{todos.length}</span>
			</h1>
			<TodoList todos={todos} priorityImages={priorityImages} />
		</div>
	);
};

export default Week;
