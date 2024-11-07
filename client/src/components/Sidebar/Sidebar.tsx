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
import tokenService from '../../services/token.js';

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

// Modal component for creating new projects
const MyCreateProjectModal = (props: ModalProps) => {
	// State to track project name input value
	const [inputValue, setInputValue] = useState('');

	// Handler for form submission
	const handleSubmit = async () => {
		// Creates new project with entered name and empty todos array
		await projectService.createProject({ id: '', name: inputValue, todos: [] });

		// Close modal if onHide prop exists
		if (props.onHide) {
			props.onHide();
		}

		// Refresh page to show new project
		window.location.reload();
	};

	// Modal UI with form for project name input
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

// Modal component for confirming project deletion
const MyDeleteConfirmationModal = (props: ModalProps) => {
	// State to track if projects list needs updating
	const navigate = useNavigate();

	// Handler for project deletion
	const handleDelete = async (id: string) => {
		try {
			// Attempt to delete project and its todos
			const response = await projectService.deleteProject(id);
			if (response.ok) {
				console.log(`Project with ID ${id} deleted successfully.`);

				// Redirect to upcoming after deletion
				navigate('/upcoming');
				window.location.reload();
			} else {
				console.error(`Failed to delete project with ID ${id}.`);
			}
		} catch (error) {
			// Handle any errors during deletion
			if (error instanceof Error) {
				console.error(`An error occurred: ${error.message}`);
			}
		}

		// Close modal if onHide prop exists
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
						// Passes id from props which was retrieved from itemId
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

// Modal for creating new todos with project assignment
const MyCreateTodoModal = (props: ModalProps) => {
	// State management for form and validation
	const [projects, setProjects] = useState<IProject[]>([]);
	const [validated, setValidated] = useState(false);
	const [selectedProject, setSelectedProject] = useState('Select a project!');
	const [priorityError, setPriorityError] = useState(false);
	const [projectError, setProjectError] = useState(false);

	// Initialize todo form data
	const [formData, setFormData] = useState<ITodo>({
		id: '',
		title: '',
		todo: '',
		dueDate: '',
		priority: '',
		project: null,
	});

	// Handle form input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Retrieving the different values from e.target
		const { name, value } = e.target;
		// Setting the form data
		setFormData((prevFormData) => {
			return {
				// Maintain the previous form data
				...prevFormData,
				// Selects e.target.name and updates the value based on the type
				[name]: value,
			};
		});
	};

	// Fetch the list of projects when the component mounts
	useEffect(() => {
		const fetchProjects = async () => {
			const fetchedProjects = await projectService.getProjects();
			setProjects(fetchedProjects);
		};
		fetchProjects();
	}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const form = event.currentTarget;

		// Validate form inputs before submitting
		// It checks if all required fields are filled and valid
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		let isFormValid = true;

		// Custom validation checks
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

		// Mark the form as validated
		setValidated(true);

		// Check if the form is valid. If it's invalid, prevent form submission.
		if (!isFormValid) {
			// Prevent the form from being submitted
			event.preventDefault();
			// Stop the event from propagating to other elements
			event.stopPropagation();
			return;
		}

		// Prepare payload for creating a todo
		const payload = {
			...formData,
			//
			project:
				formData.project && typeof formData.project === 'object'
					? formData.project.id // If project is an IProject object, extract just the ID
					: formData.project || null, // If project is already an ID string use it, otherwise null
		};
		await todoService.createTodo(payload);
		window.location.reload();

		// Close the modal if 'onHide' exists
		if (props.onHide) {
			props.onHide();
		}
	};

	// Update the state when a project is selected
	const updateProjectState = (project: IProject | null) => {
		// Updates the project in the dropdown menu
		setSelectedProject(project ? project.name : 'Upcoming');
		// Updates the project in the form data
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
								{/* Default project is Upcoming */}
								<Dropdown.Item href='#' onClick={() => updateProjectState(null)}>
									Upcoming
								</Dropdown.Item>
								{/* Maps through projects fetched from API and displays them */}
								{projects.map((project) => (
									<Dropdown.Item
										key={project.id}
										href='#'
										// Runs update project state function with the project object
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

// Sidebar component managing the sidebar menu and modals
const Sidebar = () => {
	// Sidebar state and modal open/close handlers
	const { sidebar, toggleSidebar } = useSidebar(); // Manages sidebar toggle state
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // State to manage project creation modal visibility
	const [sidebarData, setSidebarData] = useState(SidebarData); // State to manage sidebar data
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage delete confirmation modal visibility
	const [itemId, setItemId] = useState(''); // State to track which item is selected for deletion
	const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] = useState(false); // State to manage the todo creation modal visibility

	// Check for logged in user and set token on initial load
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedTodoappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			tokenService.setToken(user.token); // Set token for the authenticated user
		}
	}, []);

	// Fetch and update projects in sidebar
	useEffect(() => {
		const fetchProjects = async () => {
			// Fetch list of projects
			const projects = await projectService.getProjects();
			// Find the "Projects" category in the sidebar
			const projectsCategory = SidebarData.find(
				(category) => category.title === 'Projects'
			);
			if (projectsCategory) {
				// Add fetched projects to the sidebar data
				projectsCategory.items = [
					// Preserve the first item (e.g., 'Create new project' button)
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
				// Update the sidebar data state to reflect the fetched projects
				setSidebarData([...SidebarData]);
			}
		};
		fetchProjects();
	}, []);

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
							// Open the create todo modal
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
						{/* Render categories and their items */}
						{sidebarData.map((category, categoryIndex) => {
							return (
								<React.Fragment key={categoryIndex}>
									<h3 className={category.cName}>{category.title}</h3>
									<ul className='categories'>
										{/* Render each item in the category */}
										{category.items.map((item, index) => {
											return (
												<li
													key={index}
													className={item.cName}
													onClick={(e) => {
														// Checks if we click the create new project button
														if (item.title === 'Create new project') {
															e.preventDefault();
															// Open the project modal
															setIsProjectModalOpen(true);
														}
													}}
												>
													{/* Check if item has a 'path' (for links to pages) */}
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
																		// Open delete modal
																		setIsDeleteModalOpen(true);
																		// Set the selected item ID for deletion
																		setItemId(item.id);
																	}}
																>
																	<IoTrashBin />
																</button>
															)}
														</Link>
													) : (
														// Display 'create new project' button as it doesn't have a path
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

			{/* Conditional rendering for modals */}
			{isProjectModalOpen && (
				<MyCreateProjectModal
					// Used to decide whether the modal should be visible or not
					show={isProjectModalOpen}
					onHide={() => setIsProjectModalOpen(false)}
				/>
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
