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
	username: string;
}

const getTokenFrom = (req: Request) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

const getTodos = async (_req: Request, res: Response): Promise<Response | void> => {
	try {
		const todos = await Todo.find({})
			.populate('user', { username: 1, name: 1 })
			.populate('project', { name: 1 });
		res.json(todos);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting tasks' });
	}
};

const createTodo = async (req: Request, res: Response): Promise<Response | void> => {
	try {
		const body = req.body as TodoRequestBody;
		if (!body.todo || !body.title) {
			return res.status(400).json({ error: 'Content missing' });
		}

		const token = getTokenFrom(req);
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decodedToken = jwt.verify(token, SECRET) as DecodedToken;
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'Token invalid' });
		}
		const user = await User.findById(decodedToken.id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const todo = new Todo({
			title: body.title,
			todo: body.todo,
			dueDate: body.dueDate,
			priority: body.priority,
			project: body.project ? new Types.ObjectId(body.project) : null,
			user: user._id,
		});

		console.log('About to save todo:', todo);

		await todo.save();
		user.todos.push(todo._id);
		await user.save();

		console.log('Saved todo:', todo);

		if (body.project) {
			const project = await Project.findById(body.project);
			if (!project) {
				return res.status(400).json({ error: 'Project not found' });
			}
			project.todos.push(todo._id);
			await project.save();
		}

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

const deleteTodo = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const todo = await Todo.findById(req.params.id).populate('project');
		if (todo?.project) {
			await Project.updateOne({ _id: todo.project.id }, { $pull: { todos: todo._id } });
		}

		await Todo.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

const updateTodo = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const body = req.body as TodoRequestBody;

		console.log('Received update body:', req.body);

		if (!body.todo || !body.title) {
			return res.status(400).json({ error: 'Content cannot be empty' });
		}

		const existingTodo = await Todo.findById(req.params.id).populate('project');
		if (!existingTodo) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		existingTodo.title = body.title;
		existingTodo.todo = body.todo;
		existingTodo.dueDate = body.dueDate;
		existingTodo.priority = body.priority;

		if (body.project) {
			if (existingTodo.project) {
				await Project.updateOne(
					{ _id: existingTodo.project.id },
					{ $pull: { todos: existingTodo._id } }
				);
			}

			const newProject = await Project.findById(body.project);
			if (newProject) {
				newProject.todos.push(existingTodo._id);
				await newProject.save();
				existingTodo.project = newProject._id;
			}
		} else {
			existingTodo.project = null;
		}

		await existingTodo.save();

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
