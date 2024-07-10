// import { useSelector, useDispatch } from 'react-redux';
import React, { forwardRef, useEffect } from 'react';
import todoService from '../services/todos';
import { setTodos } from '../store/todoSlice';
import { useSidebar } from '../components/Sidebar/SidebarProvider';
import Accordion from 'react-bootstrap/Accordion';
import { useAppSelector, useAppDispatch } from '../hooks';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { FaInfoCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';

const CustomToggle = ({ eventKey }: { eventKey: string }) => {
	const decoratedOnClick = useAccordionButton(eventKey, () =>
		console.log('totally custom!')
	);

	return (
		<button type='button' className='info-btn' onClick={decoratedOnClick}>
			<FaInfoCircle />
		</button>
	);
};

interface CustomDropDownProps {
	children: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const CustomDropDown = forwardRef<HTMLAnchorElement, CustomDropDownProps>(
	({ children, onClick }, ref) => (
		<a
			href=''
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
		</a>
	)
);

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
						<Card style={{ marginBottom: '20px', borderRadius: '10px' }} key={index}>
							<Card.Header>
								<div className='left'>
									<input type='checkbox' className='checkbox' data-index={index} />
									<span className='title'>
										<b>{todo.title}</b>
									</span>
								</div>
								<div className='right'>
									{todo.dueDate && (
										<span className='due-date'>
											<b>Due:</b> {todo.dueDate}
										</span>
									)}
									<span className='priority'>{todo.priority}</span>
									<CustomToggle eventKey={index.toString()}></CustomToggle>
									<Dropdown>
										<Dropdown.Toggle as={CustomDropDown} id='dropdown-custom-component'>
											<BsThreeDots />
										</Dropdown.Toggle>

										<Dropdown.Menu>
											<Dropdown.Item eventKey='1'>Edit</Dropdown.Item>
											<Dropdown.Item eventKey='2'>Delete</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</Card.Header>
							<Accordion.Collapse eventKey={index.toString()}>
								<Card.Body className='description'>
									<b>Description:</b> {todo.todo}
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					))}
				</Accordion>
			</div>
		</div>
	);
};

export default Upcoming;
