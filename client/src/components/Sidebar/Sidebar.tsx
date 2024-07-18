import { FaBars } from 'react-icons/fa6';
import { CgClose } from 'react-icons/cg';
import { IoTrashBin } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData.js';
import '../../styles/Sidebar.scss';
import { IconContext } from 'react-icons';
import { useSidebar } from './SidebarProvider.js';
import projectService from '../../services/project.js';
import { useNavigate } from 'react-router-dom';

import Modal, { ModalProps } from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

const MyCreateProjectModal = (props: ModalProps) => {
	const [inputValue, setInputValue] = useState('');

	const handleSubmit = async () => {
		console.log(inputValue);
		await projectService.createProject({ name: inputValue });

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
			<Modal.Footer>
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
			<Modal.Body>Are you sure you want to delete this project?</Modal.Body>
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

function Sidebar() {
	const { sidebar, toggleSidebar } = useSidebar();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [sidebarData, setSidebarData] = useState(SidebarData);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [itemId, setItemId] = useState('');

	useEffect(() => {
		const fetchProjects = async () => {
			const projects = await projectService.getProjects();
			const projectsCategory = SidebarData.find(
				(category) => category.title === 'Projects'
			);
			if (projectsCategory) {
				projectsCategory.items = [
					...projectsCategory.items.slice(0, 1), // Keep the 'Create new project' item
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
															<button
																className='delete-btn'
																onClick={() => {
																	setIsDeleteModalOpen(true);
																	setItemId(item.id);
																}}
															>
																<IoTrashBin />
															</button>
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

			{isDeleteModalOpen && (
				<MyDeleteConfirmationModal
					show={isDeleteModalOpen}
					onHide={() => setIsDeleteModalOpen(false)}
					id={itemId}
				/>
			)}
		</>
	);
}

export default Sidebar;
