const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdByName: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  field: { type: String, default: '' },
  oldValue: { type: String, default: '' },
  newValue: { type: String, default: '' },
  performedBy: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Advertisement', 'Trade Show', 'Other'],
    default: 'Website',
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'],
    default: 'New',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  notes: [NoteSchema],
  activityLog: [ActivitySchema],
}, { timestamps: true });

// Text index for full-text search
LeadSchema.index({ name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Lead', LeadSchema);
