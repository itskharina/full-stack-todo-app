import Todo from '../models/todo.js';
import Project from '../models/project.js';
import User from '../models/users.js';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

if (!SECRET) {
	throw new Error('No SECRET environment variable is set');
}

interface TodoRequestBody {
	id: string;
	title: string;
	todo: string;
	dueDate?: Date;
	priority: string;
	project: string | null;
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

// Fetch all todos
const getTodos = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		// Verify and decode the token using the secret
		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}

		// Find todos belonging to the authenticated user
		const todos = await Todo.find({ user: decodedToken.id })
			.populate('user', { email: 1, first_name: 1, last_name: 1 }) // Populate user details
			.populate('project', { name: 1 }); // Populate project details (if any)
		res.json(todos); // Send the list of todos as the response
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'JsonWebTokenError') {
				return res.status(401).json({ error: 'Token invalid' });
			} else {
				return res.status(500).json({ error: 'Error getting tasks' });
			}
		}
	}
};

// Create a new todo task
const createTodo = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		// Extract the todo details from the request body
		const body = req.body as TodoRequestBody;
		if (!body.todo || !body.title) {
			return res.status(400).json({ error: 'Content missing' });
		}

		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		// Decode and verify the token using the secret
		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}

		// Find the user by their decoded token ID
		const user = await User.findById(decodedToken.id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Create a new Todo document
		const todo = new Todo({
			title: body.title,
			todo: body.todo,
			dueDate: body.dueDate,
			priority: body.priority,
			project: body.project ? new Types.ObjectId(body.project) : null, // Assign project if provided
			user: user._id, // Associate the todo with the authenticated user
		});

		// Save the new todo to the database
		await todo.save();
		// Add the todo to the user's todos array
		user.todos.push(todo._id);
		// Save the updated user document
		await user.save();

		// If a project ID is provided, associate the todo with the project
		if (body.project) {
			const project = await Project.findById(body.project);
			if (!project) {
				return res.status(400).json({ error: 'Project not found' });
			}

			// Add the todo to the project's todos array
			project.todos.push(todo._id);
			// Save the updated project document
			await project.save();
		}

		// Return the created todo as the response
		res.status(201).json(todo);
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'JsonWebTokenError') {
				return res.status(401).json({ error: 'Token invalid' });
			} else {
				return res.status(500).json({ error: 'Error adding task' });
			}
		}
	}
};

// Delete a todo task
const deleteTodo = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// Find the todo by its ID and populate project details
		const todo = await Todo.findById(req.params.id).populate('project');
		if (todo?.project) {
			// Remove todo reference from the project
			await Project.updateOne({ _id: todo.project.id }, { $pull: { todos: todo._id } });
		}

		// Find the todo by its ID and delete
		await Todo.findByIdAndDelete(req.params.id);
		// Return 204 status (no content) after successful deletion
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

// Update an existing todo task
const updateTodo = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		// Extract the updated todo details from the request body
		const body = req.body as TodoRequestBody;

		// Return 400 if title or todo content is empty
		if (!body.todo || !body.title) {
			return res.status(400).json({ error: 'Content cannot be empty' });
		}

		// Find the existing todo by its ID
		const existingTodo = await Todo.findById(req.params.id).populate('project');
		if (!existingTodo) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		// Update the existing todo fields with new values
		existingTodo.title = body.title;
		existingTodo.todo = body.todo;
		existingTodo.dueDate = body.dueDate;
		existingTodo.priority = body.priority;

		if (body.project) {
			// If a new project is specified, remove the todo from the old project
			if (existingTodo.project) {
				await Project.updateOne(
					{ _id: existingTodo.project.id },
					{ $pull: { todos: existingTodo._id } }
				);
			}

			const newProject = await Project.findById(body.project);
			if (newProject) {
				// Add the todo to the new project
				newProject.todos.push(existingTodo._id);
				await newProject.save();
				// Update the todo's project field
				existingTodo.project = newProject._id;
			}
		} else {
			existingTodo.project = null;
		}

		await existingTodo.save();
		// Return the updated todo as the response
		res.json(existingTodo);
	} catch (error) {
		next(error);
	}
};

export default {
	getTodos,
	createTodo,
	deleteTodo,
	updateTodo,
};
