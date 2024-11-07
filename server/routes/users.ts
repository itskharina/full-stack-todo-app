/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import userController from '../controllers/users.js';

// Creates a new router instance from Express
// Allows us to define a set of routes for a specific purpose
const router = express.Router();

// Define routes and their corresponding controller methods:

// GET /users - Retrieves all users
router.get('/', userController.getUsers);

// POST /users - Creates a new user
router.post('/', userController.createUser);

// DELETE /users/:id - Deletes a user by ID
// :id is a URL parameter that can be accessed in the controller
router.delete('/:id', userController.deleteUser);

export default router;
