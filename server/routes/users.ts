/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import userController from '../controllers/users.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

export default router;
