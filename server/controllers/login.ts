import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users.js';

interface LoginRequestBody {
	email: string;
	password: string;
}

const SECRET = process.env.SECRET;

if (!SECRET) {
	throw new Error('No SECRET environment variable is set');
}

const createLogin = async (req: Request, res: Response): Promise<Response | void> => {
	const body = req.body as LoginRequestBody;

	const user = await User.findOne({ email: body.email });

	const passwordCorrect =
		user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: 'Invalid email or password',
		});
	}

	const userForToken = {
		email: user.email,
		id: user._id,
	};

	const token = jwt.sign(userForToken, SECRET);

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
