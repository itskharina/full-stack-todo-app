// import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import todoService from '../services/todos';
import { setTodos } from '../store/todoSlice';
import { useSidebar } from '../components/Sidebar/SidebarProvider';
import Accordion from 'react-bootstrap/Accordion';
import { useAppSelector, useAppDispatch } from '../hooks';

const Upcoming = () => {
	const { sidebar } = useSidebar();
	const dispatch = useAppDispatch();
	useEffect(() => {
		todoService.getTodos().then((notes) => dispatch(setTodos(notes)));
	});

	const todos = useAppSelector((state) => state.todo);

	return (
		<div className={`upcoming ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>Upcoming</h1>
			<div className='accordion' style={{ width: '60%', margin: '0 auto' }}>
				<Accordion>
					{todos.map((todo, index) => (
						<Accordion.Item
							style={{ marginBottom: '20px', borderRadius: '10px' }}
							eventKey={index.toString()}
							key={index}
						>
							<Accordion.Header>
								<span>{todo.title}</span>
							</Accordion.Header>

							<Accordion.Body>{todo.todo}</Accordion.Body>
						</Accordion.Item>
					))}
				</Accordion>
			</div>
		</div>
	);
};

export default Upcoming;
