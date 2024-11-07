/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import loginController from '../controllers/login.js';

// Creates a new router instance from Express
const router = express.Router();

// POST /login - Logs the user in
router.post('/', loginController.createLogin);

export default router;
