import User from '../models/users.js';
import Todo from '../models/todo.js';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

interface UserRequestBody {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	password: string;
}

const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	const body = req.body as UserRequestBody;

	if (!body.email || !body.first_name || !body.last_name || !body.password) {
		return res.status(400).json({ error: 'Email, name, and password are required' });
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	const user = new User({
		email: body.email,
		first_name: body.first_name,
		last_name: body.last_name,
		passwordHash,
	});

	try {
		const savedUser = await user.save();
		res.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
};

const getUsers = async (_req: Request, res: Response): Promise<Response | void> => {
	try {
		const users = await User.find({}).populate('todos', { title: 1, todo: 1 });
		res.json(users);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting users' });
	}
};

const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		await Todo.deleteMany({ user: req.params.id });
		await User.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

export default {
	createUser,
	getUsers,
	deleteUser,
};
