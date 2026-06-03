import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, Mail, Phone, Building2, Globe, MessageSquare, Clock,
} from 'lucide-react';
import { leadService, noteService } from '../services';
import { formatDate, formatDateTime } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import NoteTimeline from '../components/NoteTimeline';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { STATUS_OPTIONS } from '../utils/helpers';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
      <Icon size={15} className="text-indigo-600 dark:text-indigo-400" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{value || 'Not provided'}</p>
    </div>
  </div>
);

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLead = async () => {
    try {
      const { data } = await leadService.getLead(id);
      setLead(data.data);
    } catch {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await leadService.updateLead(id, formData);
      setLead(data.data);
      toast.success('Lead updated!');
      setEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await leadService.updateLead(id, { status: newStatus });
      setLead(data.data);
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleAddNote = async (content) => {
    try {
      const { data } = await noteService.addNote(id, { content });
      setLead((prev) => ({ ...prev, notes: data.data }));
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleEditNote = async (noteId, content) => {
    try {
      const { data } = await noteService.updateNote(id, noteId, { content });
      setLead((prev) => ({ ...prev, notes: data.data }));
      toast.success('Note updated');
    } catch {
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const { data } = await noteService.deleteNote(id, noteId);
      setLead((prev) => ({ ...prev, notes: data.data }));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  if (loading) return <LoadingSpinner message="Loading lead details..." />;
  if (!lead) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/leads')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">{lead.name}</h1>
            <p className="text-sm text-slate-400 dark:text-gray-500">Lead Details · Created {formatDate(lead.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditOpen(true)} className="btn-secondary text-sm">
            <Pencil size={14} /> Edit
          </button>
          <button onClick={() => setDeleteOpen(true)} className="btn-danger text-sm">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Lead Info Card */}
          <div className="card p-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-gray-800 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {lead.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">{lead.name}</h2>
                <p className="text-sm text-slate-400 dark:text-gray-500">{lead.company || 'No company'}</p>
              </div>
            </div>

            <div className="space-y-1">
              <InfoItem icon={Mail} label="Email" value={lead.email} />
              <InfoItem icon={Phone} label="Phone" value={lead.phone} />
              <InfoItem icon={Building2} label="Company" value={lead.company} />
              <InfoItem icon={Globe} label="Source" value={lead.source} />
              <InfoItem icon={Clock} label="Updated" value={formatDateTime(lead.updatedAt)} />
            </div>
          </div>

          {/* Status & Quick Update */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Lead Status</h3>
            <div className="mb-4">
              <StatusBadge status={lead.status} className="text-sm px-3 py-1" />
            </div>
            <p className="text-xs text-slate-400 dark:text-gray-500 mb-3">Quick update status:</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={s === lead.status}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all border ${
                    s === lead.status
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={15} className="text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Original Message</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{lead.message}</p>
            </div>
          )}

          {/* Activity Log */}
          {lead.activityLog?.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Activity Log</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lead.activityLog.slice(0, 10).map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{a.action}</span>
                      {a.oldValue && a.newValue && (
                        <span className="text-slate-400"> · {a.oldValue} → {a.newValue}</span>
                      )}
                      <p className="text-slate-400 dark:text-gray-500">{a.performedBy} · {formatDateTime(a.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Notes timeline */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-5">
              Follow-Up Notes
              <span className="ml-2 text-xs font-normal text-slate-400 dark:text-gray-500">({lead.notes?.length || 0} notes)</span>
            </h3>
            <NoteTimeline
              notes={lead.notes || []}
              onAdd={handleAddNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Lead" size="lg">
        <LeadForm initialData={lead} onSubmit={handleUpdate} onCancel={() => setEditOpen(false)} loading={submitting} />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        title="Delete Lead"
        message="This will permanently delete this lead and all its notes. This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  );
};

export default LeadDetail;
