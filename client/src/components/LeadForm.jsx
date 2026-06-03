import { useState } from 'react';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../utils/helpers';
import { InlineSpinner } from './LoadingSpinner';

const LeadForm = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    source: initialData.source || 'Website',
    message: initialData.message || '',
    status: initialData.status || 'New',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  const inputClass = (field) =>
    `input-field ${errors[field] ? 'border-red-400 focus:ring-red-400' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass('name')} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Email Address *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" className={inputClass('email')} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="input-field" />
        </div>
        {/* Company */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Company Name</label>
          <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" className="input-field" />
        </div>
        {/* Source */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Lead Source</label>
          <select name="source" value={form.source} onChange={handleChange} className="input-field">
            {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">Message / Notes</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Any additional information about this lead..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <InlineSpinner size={16} /> : null}
          {loading ? 'Saving...' : (initialData._id ? 'Update Lead' : 'Create Lead')}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default LeadForm;
