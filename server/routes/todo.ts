/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import todoController from '../controllers/todo.js';

// Creates a new router instance from Express
const router = express.Router();

// Define routes and their corresponding controller methods:

// GET /users - Retrieves all todos
router.get('/', todoController.getTodos);

// POST /users - Creates a new todo
router.post('/', todoController.createTodo);

// DELETE /users/:id - Deletes a todo by ID
router.delete('/:id', todoController.deleteTodo);

// DELETE /users/:id - Updates a todo by ID
router.put('/:id', todoController.updateTodo);

export default router;
