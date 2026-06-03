const express = require('express');
const router = express.Router();
const {
  getLeads, getLead, createLead, updateLead, deleteLead,
  addNote, getNotes, updateNote, deleteNote,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);
router.route('/:id/notes').get(getNotes).post(addNote);
router.route('/:id/notes/:noteId').put(updateNote).delete(deleteNote);

module.exports = router;
