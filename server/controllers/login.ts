import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users.js';

const SECRET = process.env.SECRET;

if (!SECRET) {
	throw new Error('No SECRET environment variable is set');
}

const createLogin = async (req: Request, res: Response): Promise<Response | void> => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	const passwordCorrect =
		user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: 'Invalid username or password',
		});
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	};

	const token = jwt.sign(userForToken, SECRET);

	res.status(200).send({ token, username: user.username, name: user.name });
};

export default {
	createLogin,
};
