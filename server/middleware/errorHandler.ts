import logger from '../utils/logger.js';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(err.message, err);

	if (err.message === 'Error getting tasks') {
		return res.status(500).json({ error: 'Error getting tasks' });
	} else if (err.message === 'Error adding task') {
		return res.status(500).json({ error: 'Error adding task' });
	} else if (err.name === 'CastError') {
		return res.status(400).json({ error: 'Malformatted id' });
	} else if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message });
	}

	return res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;
