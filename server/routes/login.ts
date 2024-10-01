/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import loginController from '../controllers/login.js';

const router = express.Router();

router.post('/', loginController.createLogin);

export default router;
