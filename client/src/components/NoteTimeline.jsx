import { useState } from 'react';
import { Pencil, Trash2, Clock, User } from 'lucide-react';
import { formatDateTime, formatTimeAgo } from '../utils/helpers';
import { InlineSpinner } from './LoadingSpinner';

const NoteTimeline = ({ notes = [], onAdd, onEdit, onDelete, loading }) => {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    await onAdd(newNote.trim());
    setNewNote('');
    setSubmitting(false);
  };

  const handleStartEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setSubmitting(true);
    await onEdit(editingId, editContent.trim());
    setEditingId(null);
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Add Note */}
      <div className="card p-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Add Follow-Up Note</h4>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a follow-up note, call summary, next steps..."
          rows={3}
          className="input-field resize-none text-sm mb-3"
        />
        <button
          onClick={handleAdd}
          disabled={!newNote.trim() || submitting}
          className="btn-primary text-sm py-2"
        >
          {submitting ? <InlineSpinner size={14} /> : null}
          {submitting ? 'Adding...' : 'Add Note'}
        </button>
      </div>

      {/* Notes timeline */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-gray-500 text-sm">
          <Clock size={32} className="mx-auto mb-2 opacity-40" />
          No notes yet. Add the first one!
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note, idx) => (
            <div key={note._id} className="relative">
              {/* Timeline line */}
              {idx < notes.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-200 dark:bg-gray-700" />
              )}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-gray-900">
                  <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 card p-3">
                  {editingId === note._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                        className="input-field resize-none text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSaveEdit} disabled={submitting} className="btn-primary text-xs py-1.5">
                          {submitting ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-secondary text-xs py-1.5">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-500">
                          <span className="font-medium text-slate-600 dark:text-gray-400">{note.createdByName || 'Admin'}</span>
                          <span>·</span>
                          <span title={formatDateTime(note.createdAt)}>{formatTimeAgo(note.createdAt)}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleStartEdit(note)} className="p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded text-slate-400 hover:text-indigo-600 transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => onDelete(note._id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteTimeline;
