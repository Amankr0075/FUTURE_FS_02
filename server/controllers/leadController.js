const Lead = require('../models/Lead');

// @desc    Get all leads (with search, filter, pagination, sort)
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const { search, status, source, startDate, endDate, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) query.status = status;
    if (source) query.source = source;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, message, status } = req.body;

    const lead = await Lead.create({
      name, email, phone, company, source, message, status,
      activityLog: [{
        action: 'Lead Created',
        performedBy: req.user.name,
        newValue: status || 'New',
      }],
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A lead with this email already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Track status changes in activity log
    const activityEntries = [];
    if (req.body.status && req.body.status !== lead.status) {
      activityEntries.push({
        action: 'Status Updated',
        field: 'status',
        oldValue: lead.status,
        newValue: req.body.status,
        performedBy: req.user.name,
      });
    }

    const updateData = { ...req.body };
    if (activityEntries.length > 0) {
      updateData.$push = { activityLog: { $each: activityEntries } };
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const note = {
      content: req.body.content,
      createdBy: req.user.id,
      createdByName: req.user.name,
    };

    lead.notes.unshift(note);
    lead.activityLog.unshift({
      action: 'Note Added',
      performedBy: req.user.name,
      newValue: req.body.content.substring(0, 50) + '...',
    });
    await lead.save();

    res.status(201).json({ success: true, data: lead.notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notes for a lead
// @route   GET /api/leads/:id/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).select('notes');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead.notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/leads/:id/notes/:noteId
// @access  Private
const updateNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const note = lead.notes.id(req.params.noteId);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.content = req.body.content;
    await lead.save();

    res.status(200).json({ success: true, data: lead.notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/leads/:id/notes/:noteId
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    lead.notes.pull({ _id: req.params.noteId });
    await lead.save();

    res.status(200).json({ success: true, data: lead.notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead, addNote, getNotes, updateNote, deleteNote };
