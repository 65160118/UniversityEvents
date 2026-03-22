const express = require('express');
const eventController = require('../controllers/event.controller');
const { requireAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');

const router = express.Router();

router.get('/', eventController.listApprovedEvents);
router.get('/registrations/me', requireAuth, eventController.listMyRegistrations);
router.post(
  '/',
  requireAuth,
  requireRole(['LECTURER', 'ADMIN']),
  eventController.createEvent,
);
router.post('/:eventId/register', requireAuth, requireRole(['STUDENT']), eventController.registerForEvent);
router.patch('/:eventId/cancel-registration', requireAuth, requireRole(['STUDENT']), eventController.cancelRegistration);
router.patch('/:eventId/check-in', requireAuth, requireRole(['LECTURER', 'ADMIN']), eventController.checkInAttendee);
router.post('/:eventId/feedback', requireAuth, requireRole(['STUDENT']), eventController.submitFeedback);

module.exports = router;
