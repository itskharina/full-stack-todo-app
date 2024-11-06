import Project from '../models/project.js';
import { Request, Response, NextFunction } from 'express';
import Todo from '../models/todo.js';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

if (!SECRET) {
	throw new Error('No SECRET environment variable is set');
}

// Type definitions for request body and JWT token
interface ProjectRequestBody {
	name: string;
}

interface DecodedToken {
	id: string;
	email: string;
}

// Helper function to extract JWT token from request headers
const getTokenFrom = (req: Request) => {
	// Get the 'Authorization' header from the request
	const authorization = req.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		// Return the token by removing 'Bearer ' prefix
		return authorization.replace('Bearer ', '');
	}
	return null;
};

// Get all projects for authenticated user
const getProjects = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		// Decode and verify the token using the secret
		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		// If the decoded token does not contain a valid user ID, return 401
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}

		// Find all projects associated with the user ID in the token
		const projects = await Project.find({ user: decodedToken.id });
		// Send the projects back in the response
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

// Get a project by its name (case-insensitive search)
const getProjectByName = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	try {
		// Search for project by name using case-insensitive regex
		const project = await Project.findOne({
			name: { $regex: req.params.name, $options: 'i' },
		}).populate('todos'); // Also populate the todos related to the project
		if (!project) {
			return res.status(404).json({ error: 'Project not found' });
		}
		// Return the found project in the response
		res.json(project);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting projects' });
	}
};

// Get a project by its ID
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

// Create a new project for the authenticated user
const createProject = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		// Get the token from the request
		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		// Verify the token
		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}

		// Extract the body data (project name)
		const body = req.body as ProjectRequestBody;

		if (!body.name) {
			return res.status(400).json({
				error: 'Name required',
			});
		}

		// Create a new project document with the given name and user
		const project = new Project({
			name: body.name,
			user: decodedToken.id,
		});

		// Save the project to the database
		await project.save();

		// Return the created project with a 201 status code
		res.status(201).json(project);
	} catch (error) {
		return res.status(500).json({ error: 'Error creating project' });
	}
};

// Delete a project and all related todos
const deleteProject = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// First, delete all todos that belong to this project
		await Todo.deleteMany({ project: req.params.id });

		// Then, delete the project itself
		await Project.findByIdAndDelete(req.params.id);
		// Return a 204 (no content) after successful deletion
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
