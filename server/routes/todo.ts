/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import todoController from '../controllers/todo.js';

const router = express.Router();

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
