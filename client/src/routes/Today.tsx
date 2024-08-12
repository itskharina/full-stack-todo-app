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
import { isToday } from 'date-fns';
import { ITodo } from '../store/todoSlice';

const Today = () => {
	const { sidebar } = useSidebar();
	const dispatch = useAppDispatch();

	useEffect(() => {
		todoService.getTodos().then((notes) => {
			console.log(notes);
			const todaysNotes: ITodo[] = [];
			notes.forEach((note: ITodo) => {
				if (note.dueDate && isToday(new Date(note.dueDate))) {
					todaysNotes.push(note);
				}
			});
			dispatch(setTodos(todaysNotes));
		});
	}, [dispatch]);

	const todos = useAppSelector((state) => state.todo);

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
		<div className={`today ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>
				Today <span className='todos-length'>{todos.length}</span>
			</h1>
			<TodoList todos={todos} priorityImages={priorityImages} />
		</div>
	);
};

export default Today;
