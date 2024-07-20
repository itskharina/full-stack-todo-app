import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { format } from 'date-fns';
import { FaInfoCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { ITodo } from '../store/todoSlice';
import { TbSubtask } from 'react-icons/tb';

interface TodoItemProps {
	todo: ITodo;
	index: number;
	priorityImages: {
		high: string;
		medium: string;
		low: string;
		none: string;
		[key: string]: string;
	};
}

interface TodoListProps {
	todos: ITodo[];
	priorityImages: {
		high: string;
		medium: string;
		low: string;
		none: string;
	};
}

const TodoItem = ({ todo, index, priorityImages }: TodoItemProps) => (
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
				<div className='description-content'>
					<p>
						<b>Description:</b> {todo.todo}
					</p>
					<p>
						{todo.project && (
							<p className='project-name'>
								<TbSubtask />
								{todo.project.name}
							</p>
						)}
					</p>
				</div>
			</Card.Body>
		</Accordion.Collapse>
	</Card>
);

const TodoList = ({ todos, priorityImages }: TodoListProps) => (
	<Accordion>
		{todos.map((todo, index) => (
			<TodoItem key={index} todo={todo} index={index} priorityImages={priorityImages} />
		))}
	</Accordion>
);

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

const CustomDropDown = React.forwardRef<HTMLAnchorElement, CustomDropDownProps>(
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

export default TodoList;
