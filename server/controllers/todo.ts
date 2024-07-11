import Todo from '../models/todo.js';
// import User from '../models/users';
import { Request, Response, NextFunction } from 'express';

interface TodoRequestBody {
	title: string;
	todo: string;
	dueDate?: Date;
	priority: string;
}

const getTodos = async (
	_req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const todos = await Todo.find({});
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
			return res.status(400).json({
				error: 'Content missing',
			});
		}
		const todo = new Todo({
			title: body.title,
			todo: body.todo,
			dueDate: body.dueDate, // Include dueDate
			priority: body.priority, // Include priority,
		});

		console.log('About to save todo:', todo);

		await todo.save();

		console.log('Saved todo:', todo);

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

		const todo = {
			title: body.title,
			todo: body.todo,
			dueDate: body.dueDate, // Include dueDate
			priority: body.priority, // Include priority
		};

		const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, todo, { new: true });

		if (!updatedTodo) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		res.json(updatedTodo);
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
