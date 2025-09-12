import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByRange,
  getPublicEvents
} from '../controllers/eventController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateEvent, handleValidationErrors } from '../middleware/validation.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public events route
router.get('/public', getPublicEvents);

// Authenticated routes
router.use(authenticateToken);

// Event routes
router.get('/', getEvents);
router.get('/range/:start/:end', getEventsByRange);
router.get('/:id', getEvent);
router.post('/', requireAdmin, uploadSingle, handleUploadError, validateEvent, handleValidationErrors, createEvent);
router.put('/:id', requireAdmin, uploadSingle, handleUploadError, validateEvent, handleValidationErrors, updateEvent);
router.delete('/:id', requireAdmin, deleteEvent);

export default router;
