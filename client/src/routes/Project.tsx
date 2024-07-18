import { useParams } from 'react-router-dom';
import projectService from '../services/project.js';
import React, { forwardRef, useEffect, useState } from 'react';
import { useSidebar } from '../components/Sidebar/SidebarProvider';

import redFlag from '../assets/redflag.png';
import orangeFlag from '../assets/orangeflag.png';
import greenFlag from '../assets/greenflag.png';
import greyFlag from '../assets/greyflag.png';
import Card from 'react-bootstrap/Card';
import { FaInfoCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from 'react-bootstrap/Dropdown';
import { format } from 'date-fns';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

interface ITodo {
	title: string;
	todo: string;
	dueDate?: Date;
	priority: 'none' | 'high' | 'medium' | 'low';
	project: string | null;
}

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

const Project = () => {
	const { sidebar } = useSidebar();

	const { projectName } = useParams();

	const [project, setProject] = useState<{
		name: string;
		todos: ITodo[];
	} | null>(null);

	useEffect(() => {
		const fetchProject = async () => {
			if (projectName) {
				const project = await projectService.getProjectByName(projectName);
				setProject(project);
			}
		};
		fetchProject();
	}, [projectName]);

	if (!project) {
		return <div>Loading...</div>;
	}

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
		<div className={`project ${sidebar ? 'sidebar-open' : ''}`}>
			<h1>
				{project.name} <span className='todos-length'>{project.todos.length}</span>
			</h1>
			<ul>
				{project.todos.map((todo, index) => (
					<Accordion>
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
					</Accordion>
				))}
			</ul>
		</div>
	);
};

export default Project;
