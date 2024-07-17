import Todo from '../models/todo.js';
import Project from '../models/project.js';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

// import User from '../models/users';

interface TodoRequestBody {
	title: string;
	todo: string;
	dueDate?: Date;
	priority: string;
	project: string | null;
}

const getTodos = async (
	_req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const todos = await Todo.find({}).populate('project');
		res.json(todos);
	} catch (error) {
		if (error instanceof Error) {
			error.message = 'Error getting tasks';
		}
		next(error);
	}
};

const createTodo = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const body = req.body as TodoRequestBody;
		if (!body.todo || !body.title) {
			return res.status(400).json({ error: 'Content missing' });
		}

		const todo = new Todo({
			title: body.title,
			todo: body.todo,
			dueDate: body.dueDate,
			priority: body.priority,
			project: body.project ? new Types.ObjectId(body.project) : null,
		});

		console.log('About to save todo:', todo);

		await todo.save();

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
			error.message = 'Error adding tasks';
		}
		next(error);
	}
};

const deleteTodo = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// Find the todo by its ID and populate the project field
		const todo = await Todo.findById(req.params.id).populate('project');
		if (todo?.project) {
			await Project.updateOne({ _id: todo.project }, { $pull: { todos: todo._id } });
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

		// Handle project association
		if (body.project && body.project !== existingTodo.project?.toString()) {
			// Remove from old project
			if (existingTodo.project) {
				await Project.updateOne(
					{ _id: existingTodo.project.toString() },
					{ $pull: { todos: existingTodo._id } }
				);
			}

			// Add to new project
			const newProject = await Project.findById(body.project);
			if (newProject) {
				newProject.todos.push(existingTodo._id as Types.ObjectId);
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
