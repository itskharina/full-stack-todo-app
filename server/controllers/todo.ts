import Todo from '../models/todo.js';
// import User from '../models/users';
import { Request, Response, NextFunction } from 'express';

interface TodoRequestBody {
	todo: string;
	important?: boolean;
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

		if (!body.todo) {
			return res.status(400).json({
				error: 'Content missing',
			});
		}
		const todo = new Todo({
			todo: body.todo,
			important: body.important === undefined ? false : body.important,
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

// change importance
// update notes

export default {
	getTodos,
	createTodo,
	deleteTodo,
};
