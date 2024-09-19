import config from './utils/config.js';
import express from 'express';
import cors from 'cors';
import './config/db';
import errorHandler from './middleware/errorHandler.js';
import todoRouter from './routes/todo.js';
import projectRouter from './routes/project.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/todos', todoRouter);
app.use('/projects', projectRouter);
app.use('/users', usersRouter);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
	app.listen(config.PORT, () => {
		console.log(`Server running on port ${config.PORT}`);
	});
}

export default app;
