/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import projectController from '../controllers/project.js';

const router = express.Router();

// Define routes and their corresponding controller methods:

// GET /projects - Retrieves all projects
router.get('/', projectController.getProjects);

// GET /projects - Retrieves a project by its name
router.get('/:name', projectController.getProjectByName);

// GET /projects - Retrieves a project by its ID
router.get('/:id', projectController.getProjectById);

// POST /projects - Creates a new project
router.post('/', projectController.createProject);

// DELETE /projects/:id - Deletes a project by ID
router.delete('/:id', projectController.deleteProject);

export default router;
