import logger from '../utils/logger.js';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(err.message, err);

	if (err.name === 'CastError') {
		return res.status(400).json({ error: 'Malformatted id' });
	} else if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message });
	} else if (err.message.includes('E11000 duplicate key error')) {
		return res.status(400).json({ error: 'Expected "username" to be unique' });
	} else if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({ error: 'Token invalid' });
	}

	return res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;
