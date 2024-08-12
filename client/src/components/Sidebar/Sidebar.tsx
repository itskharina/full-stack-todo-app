import { FaBars } from 'react-icons/fa6';
import { CgClose } from 'react-icons/cg';
import { IoTrashBin } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData.js';
import '../../styles/Sidebar.scss';
import { IconContext } from 'react-icons';
import { useSidebar } from './SidebarProvider.js';
import projectService from '../../services/project.js';
import todoService from '../../services/todos.js';
import { useNavigate } from 'react-router-dom';

import { ITodo } from '../../store/todoSlice.js';
import { IProject } from '../../store/todoSlice.js';

import Modal, { ModalProps } from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import redFlag from '../../assets/redflag.png';
import orangeFlag from '../../assets/orangeflag.png';
import greenFlag from '../../assets/greenflag.png';
import greyFlag from '../../assets/greyflag.png';

const MyCreateProjectModal = (props: ModalProps) => {
	const [inputValue, setInputValue] = useState('');

	const handleSubmit = async () => {
		await projectService.createProject({ id: '', name: inputValue, todos: [] });

		if (props.onHide) {
			props.onHide();
		}
	};

	return (
		<Modal {...props} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>Add your project!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='text'
							autoFocus
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer style={{ padding: '12px', justifyContent: 'end' }}>
				<Button
					variant='primary'
					onClick={() => {
						handleSubmit();
					}}
				>
					Add
				</Button>
				<Button variant='secondary' onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const MyDeleteConfirmationModal = (props: ModalProps) => {
	const [projectsUpdated, setProjectsUpdated] = useState(false);
	const navigate = useNavigate();

	const handleDelete = async (id: string) => {
		try {
			const response = await projectService.deleteProject(id);
			if (response.ok) {
				console.log(`Project with ID ${id} deleted successfully.`);
				setProjectsUpdated(!projectsUpdated);
				navigate('/');
			} else {
				console.error(`Failed to delete project with ID ${id}.`);
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
			<Modal.Body>
				Are you sure you want to delete this project? All of the tasks associated with
				this project will disappear too.
			</Modal.Body>
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

const MyCreateTodoModal = (props: ModalProps) => {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [validated, setValidated] = useState(false);
	const [selectedProject, setSelectedProject] = useState('Select a project!');
	const [priorityError, setPriorityError] = useState(false);
	const [projectError, setProjectError] = useState(false);
	const [formData, setFormData] = useState<ITodo>({
		id: '',
		title: '',
		todo: '',
		dueDate: '',
		priority: '',
		project: null,
	});

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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
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
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		console.log('formData before submit', formData);
		console.log('Submitting project ID:', formData.project);

		const payload = { ...formData, project: formData.project };
		await todoService.createTodo(payload);
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
				<Modal.Title id='contained-modal-title-vcenter'>Add your task!</Modal.Title>
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
					<Form.Group className='mb-3' controlId='dueDate'>
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
						<div className='dropdown-container'>
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
								Add
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

const Sidebar = () => {
	const { sidebar, toggleSidebar } = useSidebar();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [sidebarData, setSidebarData] = useState(SidebarData);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [itemId, setItemId] = useState('');
	const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			const projects = await projectService.getProjects();
			const projectsCategory = SidebarData.find(
				(category) => category.title === 'Projects'
			);
			if (projectsCategory) {
				projectsCategory.items = [
					...projectsCategory.items.slice(0, 1),
					...projects.map((project: { id: string; name: string }) => {
						return {
							title: project.name,
							path: `/projects/${project.name.toLowerCase()}`,
							icon: <FaIcons.FaClipboardList />,
							cName: 'nav-text',
							id: project.id,
						};
					}),
				];
				setSidebarData([...sidebarData]);
			}
		};
		fetchProjects();
	}, [sidebarData]);

	return (
		<>
			<IconContext.Provider value={{ color: 'undefined' }}>
				<div className='navbar'>
					<button
						className='menu-bars'
						onClick={toggleSidebar}
						aria-label='Toggle sidebar'
					>
						<FaBars color='white' />
					</button>
					<button
						className='create-todo-btn'
						aria-label='Add new task'
						onClick={(e) => {
							e.preventDefault();
							setIsCreateTodoModalOpen(true);
						}}
					>
						+ Add new task
					</button>
				</div>

				<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
					<ul className='nav-menu-items' onClick={toggleSidebar}>
						<li className='navbar-toggle'>
							<Link to='#' className='menu-bars'>
								<CgClose color='#524f5f' />
							</Link>
						</li>
						{SidebarData.map((category, categoryIndex) => {
							return (
								<React.Fragment key={categoryIndex}>
									<h3 className={category.cName}>{category.title}</h3>
									<ul className='categories'>
										{category.items.map((item, index) => {
											return (
												<li
													key={index}
													className={item.cName}
													onClick={(e) => {
														if (item.title === 'Create new project') {
															e.preventDefault();
															setIsModalOpen(true);
														}
													}}
												>
													{item.path ? (
														<Link to={item.path}>
															<div className='left-sidebar-data'>
																{item.icon}
																<span>{item.title}</span>
															</div>
															{item.id !== 'main-tasks' && (
																<button
																	className='delete-btn'
																	onClick={() => {
																		setIsDeleteModalOpen(true);
																		setItemId(item.id);
																	}}
																>
																	<IoTrashBin />
																</button>
															)}
														</Link>
													) : (
														<span className='project-btn'>
															{item.icon}
															<span>{item.title}</span>
														</span>
													)}
												</li>
											);
										})}
									</ul>
								</React.Fragment>
							);
						})}
					</ul>
				</nav>
			</IconContext.Provider>

			{isModalOpen && (
				<MyCreateProjectModal show={isModalOpen} onHide={() => setIsModalOpen(false)} />
			)}

			{isCreateTodoModalOpen && (
				<MyCreateTodoModal
					show={isCreateTodoModalOpen}
					onHide={() => setIsCreateTodoModalOpen(false)}
				/>
			)}

			{isDeleteModalOpen && (
				<MyDeleteConfirmationModal
					show={isDeleteModalOpen}
					onHide={() => setIsDeleteModalOpen(false)}
					id={itemId}
				/>
			)}
		</>
	);
};

export default Sidebar;
