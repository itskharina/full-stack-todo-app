import config from './utils/config.js';
import express from 'express';
import cors from 'cors';
import './config/db';
import errorHandler from './middleware/errorHandler.js';
import todoRouter from './routes/todo.js';
import projectRouter from './routes/project.js';
import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';

// Initialize Express application
const app = express();

app.use(cors()); // Enables CORS for handling requests from different origins
app.use(express.json()); // Enables JSON parsing for incoming requests, allowing the app to process JSON payloads

// Route definitions, attaching routers to specific base paths
app.use('/todos', todoRouter); // Handle todo-related routes
app.use('/projects', projectRouter); // Handle project-related routes
app.use('/users', usersRouter); // Handle user-related routes
app.use('/login', loginRouter); // Handle authentication route

// Adds custom error-handling middleware for handling errors across the app
app.use(errorHandler);

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
	// Starts the server and listens for incoming reqeuests on the specified port
	app.listen(config.PORT, () => {
		console.log(`Server running on port ${config.PORT}`);
	});
}

export default app;
