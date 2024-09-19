import Project from '../models/project.js';
import { Request, Response, NextFunction } from 'express';
import Todo from '../models/todo.js';

interface ProjectRequestBody {
	name: string;
}

const getProjects = async (_req: Request, res: Response): Promise<Response | void> => {
	try {
		const projects = await Project.find({});
		res.json(projects);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting projects' });
	}
};

const getProjectByName = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	try {
		const project = await Project.findOne({
			name: { $regex: req.params.name, $options: 'i' },
		}).populate('todos');
		if (!project) {
			return res.status(404).json({ error: 'Project not found' });
		}
		res.json(project);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting projects' });
	}
};

const getProjectById = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const project = await Project.findOne({
			name: { $regex: req.params.id, $options: 'i' },
		}).populate('todos');
		if (!project) {
			return res.status(404).json({ error: 'Project not found' });
		}
		res.json(project);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting projects' });
	}
};

const createProject = async (req: Request, res: Response): Promise<Response | void> => {
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
		return res.status(500).json({ error: 'Error creating project' });
	}
};

const deleteProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		await Todo.deleteMany({ project: req.params.id });

		await Project.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

export default {
	getProjects,
	getProjectByName,
	createProject,
	deleteProject,
	getProjectById,
};
