import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { format } from 'date-fns';
import { FaInfoCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { ITodo } from '../store/todoSlice';
import { IProject } from '../store/todoSlice';
import { TbSubtask } from 'react-icons/tb';
import { projectToNameRepresentation } from '../projectUtils';
import todoService from '../services/todos.js';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

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

const TodoItem = ({ todo, index, priorityImages }: TodoItemProps) => {
	const [projectDetails, setProjectDetails] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	useEffect(() => {
		const fetchProjectDetails = async () => {
			if (todo.project) {
				const details = projectToNameRepresentation(todo.project as unknown as IProject);
				setProjectDetails(details);
			} else {
				setProjectDetails(null);
			}
		};

		fetchProjectDetails();
	}, [todo.project]);

	const handleEdit = () => {
		console.log('clicked edit');
	};

	return (
		<>
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
								<Dropdown.Item eventKey='1' onClick={handleEdit}>
									Edit
								</Dropdown.Item>
								<Dropdown.Item
									eventKey='2'
									onClick={() => {
										setIsDeleteModalOpen(true);
									}}
								>
									Delete
								</Dropdown.Item>
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
								{projectDetails && (
									<p className='project-name'>
										<TbSubtask />
										{projectDetails}
									</p>
								)}
							</p>
						</div>
					</Card.Body>
				</Accordion.Collapse>
			</Card>

			{isDeleteModalOpen && (
				<MyDeleteConfirmationModal
					show={isDeleteModalOpen}
					onHide={() => setIsDeleteModalOpen(false)}
					id={todo.id}
				/>
			)}
		</>
	);
};

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

const MyDeleteConfirmationModal = (props: ModalProps) => {
	const handleDelete = async (id: string) => {
		try {
			const response = await todoService.deleteTodo(id);
			if (response.ok) {
				window.location.reload();
				console.log(`Todo with ID ${id} deleted successfully.`);
			} else {
				console.error(`Failed to delete todo with ID ${id}.`);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(`An error occurred: ${error.message}`);
			}
		}

		if (props.onHide) {
			props.onHide();
		}
	};

	return (
		<Modal {...props} size='sm' aria-labelledby='delete-confirm-modal' centered>
			<Modal.Header closeButton>
				<Modal.Title id='delete-confirm-modal'>Confirm Deletion</Modal.Title>
			</Modal.Header>
			<Modal.Body>Are you sure you want to delete this todo?</Modal.Body>
			<Modal.Footer>
				<Button
					variant='danger'
					onClick={() => {
						handleDelete(props.id);
					}}
				>
					Confirm Delete
				</Button>
				<Button variant='secondary' onClick={props.onHide}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default TodoList;
