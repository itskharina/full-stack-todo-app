import { FaBars } from 'react-icons/fa6';
import { CgClose } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData.js';
import '../../styles/Sidebar.scss';
import { IconContext } from 'react-icons';
import { useSidebar } from './SidebarProvider.js';
import projectService from '../../services/project.js';

import Modal, { ModalProps } from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

const MyVerticallyCenteredModal = (props: ModalProps) => {
	const [inputValue, setInputValue] = useState('');

	function handleSubmit() {
		console.log(inputValue);
	}

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
						props.onHide();
					}}
				>
					Save Changes
				</Button>
				<Button variant='secondary' onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

function Sidebar() {
	const { sidebar, toggleSidebar } = useSidebar();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			const projects = await projectService.getProjects();
			const projectsCategory = SidebarData.find(
				(category) => category.title === 'Projects'
			);
			if (projectsCategory) {
				projectsCategory.items = [
					...projectsCategory.items.slice(0, 1), // Keep the 'Create new project' item
					...projects.map((project) => {
						return {
							title: project.name,
							path: `/projects/${project.name.toLowerCase()}/${project._id}`,
							icon: <FaIcons.FaClipboardList />,
							cName: 'nav-text',
						};
					}),
				];
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
				</div>

				<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
					<ul className='nav-menu-items' onClick={toggleSidebar}>
						<li className='navbar-toggle'>
							<Link to='#' className='menu-bars'>
								<CgClose color='#524f5f' />
							</Link>
						</li>
						{SidebarData.map((category) => {
							return (
								<>
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
															{item.icon}
															<span>{item.title}</span>
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
								</>
							);
						})}
					</ul>
				</nav>
			</IconContext.Provider>

			{isModalOpen && (
				<MyVerticallyCenteredModal
					show={isModalOpen}
					onHide={() => setIsModalOpen(false)}
				/>
			)}
		</>
	);
}

export default Sidebar;
