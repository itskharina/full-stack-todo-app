import Project from '../models/project.js';
import { Request, Response, NextFunction } from 'express';

interface ProjectRequestBody {
	name: string;
}

const getProjects = async (
	_req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const projects = await Project.find({});
		res.json(projects);
	} catch (error) {
		if (error instanceof Error) {
			error.message = 'Error getting projects';
		}
		next(error);
	}
};

const getProjectById = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const project = await Project.findById(req.params.id).populate('todos');
		if (!project) {
			return res.status(404).json({ error: 'Project not found' });
		}
		res.json(project);
	} catch (error) {
		if (error instanceof Error) {
			error.message = 'Error getting project';
		}
		next(error);
	}
};

const createProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const body = req.body as ProjectRequestBody;

		if (!body.name) {
			return res.status(400).json({
				error: 'Name required',
			});
		}

		const project = new Project({
			name: body.name,
		});

		console.log('About to save project:', project);

		await project.save();

		console.log('About to save project:', project);

		res.status(201).json(project);
	} catch (error) {
		if (error instanceof Error) {
			error.message = 'Error creating project';
		}
		next(error);
	}
};

const deleteProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		await Project.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

export default {
	getProjects,
	getProjectById,
	createProject,
	deleteProject,
};
