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

// Create a new user
const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	const body = req.body as UserRequestBody;

	// Check if the required fields (email, name, password) are provided
	if (!body.email || !body.first_name || !body.last_name || !body.password) {
		return res.status(400).json({ error: 'Email, name, and password are required' });
	}

	// Define the number of salt rounds (how many times we perform hashing) for bcrypt hashing
	const saltRounds = 10;
	// Hash the password using bcrypt with the specified salt rounds
	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	// Create a new User document with the provided data and the hashed password
	const user = new User({
		email: body.email,
		first_name: body.first_name,
		last_name: body.last_name,
		passwordHash,
	});

	try {
		// Attempt to save the user to the database
		const savedUser = await user.save();
		// If successful, return the saved user object with a 201 status
		res.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
};

// Get all users from the database
const getUsers = async (_req: Request, res: Response): Promise<Response | void> => {
	try {
		// Find all users and populate their associated todos with only the title and todo fields
		const users = await User.find({}).populate('todos', { title: 1, todo: 1 });
		// Return the list of users in the response
		res.json(users);
	} catch (error) {
		return res.status(500).json({ error: 'Error getting users' });
	}
};

// Delete a user from the database
const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// Delete all todos associated with the user before deleting the user
		await Todo.deleteMany({ user: req.params.id });
		// Delete the user by their ID
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
