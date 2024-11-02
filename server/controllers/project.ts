import Project from '../models/project.js';
import { Request, Response, NextFunction } from 'express';
import Todo from '../models/todo.js';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

if (!SECRET) {
	throw new Error('No SECRET environment variable is set');
}

interface ProjectRequestBody {
	name: string;
}

interface DecodedToken {
	id: string;
	email: string;
}

const getTokenFrom = (req: Request) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

const getProjects = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		console.log('decodedToken', decodedToken);
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}

		const projects = await Project.find({ user: decodedToken.id });
		console.log(projects);
		res.json(projects);
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'JsonWebTokenError') {
				return res.status(401).json({ error: 'Token invalid' });
			}
			return res.status(500).json({ error: 'Error getting projects' });
		}
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
		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}

		const body = req.body as ProjectRequestBody;

		if (!body.name) {
			return res.status(400).json({
				error: 'Name required',
			});
		}

		const project = new Project({
			name: body.name,
			user: decodedToken.id,
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
