/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import projectController from '../controllers/project.js';

const router = express.Router();

router.get('/', projectController.getProjects);
router.get('/:name', projectController.getProjectByName);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.delete('/:id', projectController.deleteProject);

export default router;
