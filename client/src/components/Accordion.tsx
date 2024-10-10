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
import projectService from '../services/project.js';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { Button, DropdownButton, Form } from 'react-bootstrap';

import redFlag from '../assets/redflag.png';
import orangeFlag from '../assets/orangeflag.png';
import greenFlag from '../assets/greenflag.png';
import greyFlag from '../assets/greyflag.png';

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
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

	const completeTodo = async (id: string) => {
		try {
			const element = document.getElementById(id);
			if (element) {
				element.classList.add('strikethrough');

				setTimeout(async () => {
					const response = await todoService.deleteTodo(id);
					if (response.ok) {
						console.log(`Todo with ID ${id} has been marked as completed.`);
					} else {
						console.error(`Failed to mark todo with ID ${id} as completed.`);
					}

					window.location.reload();
				}, 150);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(`An error occurred: ${error.message}`);
			}
		}
	};

	return (
		<>
			<Card style={{ marginBottom: '20px' }} key={index} id={todo.id}>
				<Card.Header>
					<div className='left'>
						<input
							type='checkbox'
							className='checkbox'
							data-index={index}
							onClick={() => completeTodo(todo.id)}
						/>
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
								<Dropdown.Item
									eventKey='1'
									onClick={() => {
										setIsEditModalOpen(true);
									}}
								>
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

			{isEditModalOpen && (
				<MyEditTodoModal
					show={isEditModalOpen}
					onHide={() => setIsEditModalOpen(false)}
					id={todo.id}
					todo={todo}
				/>
			)}
		</>
	);
};

const TodoList = ({ todos, priorityImages }: TodoListProps) => {
	const sortedTodos = [...todos].sort((a, b) => {
		const aDueDate = a.dueDate ? new Date(a.dueDate) : null;
		const bDueDate = b.dueDate ? new Date(b.dueDate) : null;

		if (!aDueDate) return 1;
		if (!bDueDate) return -1;
		return aDueDate.getTime() - bDueDate.getTime();
	});

	return (
		<Accordion>
			{sortedTodos.map((todo, index) => (
				<TodoItem key={index} todo={todo} index={index} priorityImages={priorityImages} />
			))}
		</Accordion>
	);
};

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
	onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
			<Modal.Footer style={{ padding: '12px' }}>
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

const MyEditTodoModal = (props: ModalProps & { todo: ITodo }) => {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [validated, setValidated] = useState(false);
	const [priorityError, setPriorityError] = useState(false);
	const [projectError, setProjectError] = useState(false);
	const [selectedProject, setSelectedProject] = useState('Select a project!');
	const [formData, setFormData] = useState<ITodo>({
		...props.todo,
		dueDate: props.todo.dueDate
			? format(new Date(props.todo.dueDate), 'yyyy-MM-dd')
			: undefined,
	});

	console.log(formData);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[name]: type === 'checkbox' ? checked : value,
			};
		});
	};

	useEffect(() => {
		const fetchProjects = async () => {
			const fetchedProjects = await projectService.getProjects();
			setProjects(fetchedProjects);
		};
		fetchProjects();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
			e.preventDefault();
			e.stopPropagation();
		}

		let isFormValid = true;

		if (!formData.priority) {
			setPriorityError(true);
			isFormValid = false;
		} else {
			setPriorityError(false);
		}

		if (selectedProject === 'Select a project!') {
			setProjectError(true);
			isFormValid = false;
		} else {
			setProjectError(false);
		}

		setValidated(true);

		if (!isFormValid) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		console.log('formData before submit', formData);
		console.log('Submitting project ID:', formData.project);

		const payload = { ...formData, project: formData.project };
		await todoService.updateTodo(payload);
		window.location.reload();

		if (props.onHide) {
			props.onHide();
		}
	};

	const updateProjectState = (project: IProject | null) => {
		setSelectedProject(project ? project.name : 'Upcoming');
		setFormData((prevFormData) => ({
			...prevFormData,
			project: project ? project.id : null,
		}));
	};

	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
			className='width'
		>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>Edit your task!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Group className='mb-3' controlId='title'>
						<Form.Label>Title</Form.Label>
						<Form.Control
							type='text'
							autoFocus
							value={formData.title}
							onChange={handleChange}
							name='title'
							required
						/>
						<Form.Control.Feedback type='invalid'>
							Please add a title.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='description'>
						<Form.Label>Description</Form.Label>
						<Form.Control
							type='textarea'
							autoFocus
							value={formData.todo}
							onChange={handleChange}
							name='todo'
							required
						/>
						<Form.Control.Feedback type='invalid'>
							Please add a description.
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
						<Form.Label>Due Date</Form.Label>
						<Form.Control
							type='date'
							autoFocus
							value={formData.dueDate}
							onChange={handleChange}
							name='dueDate'
						/>
					</Form.Group>
					<h2 className='priority-title'>Priority</h2>
					<div className='flags'>
						<div className='priority-container'>
							<h3 className='priority-subtitle'>None</h3>
							<Form.Check
								inline
								label={
									<img className='priority-flag' src={greyFlag} alt='no priority flag' />
								}
								type='radio'
								id='none'
								name='priority'
								value='none'
								checked={formData.priority === 'none'}
								onChange={handleChange}
							/>
						</div>
						<div className='priority-container'>
							<h3 className='priority-subtitle'>Low</h3>
							<Form.Check
								inline
								label={
									<img
										className='priority-flag'
										src={greenFlag}
										alt='low priority flag'
									/>
								}
								type='radio'
								id='low'
								name='priority'
								value='low'
								checked={formData.priority === 'low'}
								onChange={handleChange}
							/>
						</div>
						<div className='priority-container'>
							<h3 className='priority-subtitle'>Medium</h3>
							<Form.Check
								inline
								label={
									<img
										className='priority-flag'
										src={orangeFlag}
										alt='medium priority flag'
									/>
								}
								type='radio'
								id='medium'
								name='priority'
								value='medium'
								checked={formData.priority === 'medium'}
								onChange={handleChange}
							/>
						</div>
						<div className='priority-container'>
							<h3 className='priority-subtitle'>High</h3>
							<Form.Check
								inline
								label={
									<img className='priority-flag' src={redFlag} alt='high priority flag' />
								}
								type='radio'
								id='high'
								name='priority'
								value='high'
								checked={formData.priority === 'high'}
								onChange={handleChange}
							/>
						</div>
					</div>
					{priorityError && (
						<p className='priority-validation'>Please select a priority.</p>
					)}
					<Modal.Footer>
						<div>
							<DropdownButton
								id='dropdown-basic-button'
								title={selectedProject}
								key={selectedProject}
							>
								<Dropdown.Item href='#' onClick={() => updateProjectState(null)}>
									Upcoming
								</Dropdown.Item>
								{projects.map((project) => (
									<Dropdown.Item
										key={project.id}
										href='#'
										onClick={() => updateProjectState(project)}
									>
										{project.name}
									</Dropdown.Item>
								))}
							</DropdownButton>
							{projectError && (
								<p className='project-validation'>Please select a project.</p>
							)}
						</div>
						<div className='modal-footer-btns'>
							<Button variant='primary' type='submit'>
								Edit
							</Button>
							<Button variant='secondary' onClick={props.onHide}>
								Close
							</Button>
						</div>
					</Modal.Footer>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default TodoList;
