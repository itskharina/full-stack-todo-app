import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users.js';

interface LoginRequestBody {
	email: string;
	password: string;
}

// Retrieve the JWT secret from the environment variables.
const SECRET = process.env.SECRET;

if (!SECRET) {
	throw new Error('No SECRET environment variable is set');
}

// This function handles the login process:
// It receives the request and sends the response
const createLogin = async (req: Request, res: Response): Promise<Response | void> => {
	// Extract the body from the request and cast it to the LoginRequestBody type.
	const body = req.body as LoginRequestBody;

	// Look for a user in the database that matches the provided email
	const user = await User.findOne({ email: body.email });

	// If the user is found, compare the provided password with the stored hashed password.
	// bcrypt.compare returns a boolean indicating whether the password matches.
	const passwordCorrect =
		user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: 'Invalid email or password',
		});
	}

	// Prepare the user data that will be included in the JWT token (email and user ID).
	const userForToken = {
		email: user.email,
		id: user._id,
	};

	// Create the JWT token by signing the user data with the SECRET
	const token = jwt.sign(userForToken, SECRET);

	// Send the response back to the client with the token and user details (email, first name, last name).
	res.status(200).send({
		token,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
	});
};

export default {
	createLogin,
};
