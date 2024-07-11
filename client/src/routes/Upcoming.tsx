import { format } from 'date-fns';
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
import '../styles/Upcoming.scss';

import redFlag from '../assets/redflag.png';
import orangeFlag from '../assets/orangeflag.png';
import greenFlag from '../assets/greenflag.png';
import greyFlag from '../assets/greyflag.png';

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
		<div className={`upcoming ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>
				Upcoming <span className='todos-length'>{todos.length}</span>
			</h1>
			<Accordion>
				{todos.map((todo, index) => (
					<Card style={{ marginBottom: '20px' }} key={index}>
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
										<b>Due:</b> {format(todo.dueDate, 'do MMM yyyy')}
									</span>
								)}
								<img className='priority' src={priorityImages[todo.priority]} />
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
	);
};

export default Upcoming;
