import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, Eye, Download, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { leadService } from '../services';
import { formatDate, exportToCSV } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SortIcon = ({ field, current }) => {
  const isActive = current?.replace('-', '') === field;
  const isDesc = current?.startsWith('-');
  return (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp size={10} className={isActive && !isDesc ? 'text-indigo-600' : 'text-slate-300'} />
      <ChevronDown size={10} className={isActive && isDesc ? 'text-indigo-600' : 'text-slate-300'} />
    </span>
  );
};

const Leads = () => {
  const navigate = useNavigate();
  const { leads, loading, pagination, params, updateParams, setPage, refetch } = useLeads();
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSort = (field) => {
    const current = params.sort || '-createdAt';
    const isDesc = current === `-${field}`;
    updateParams({ sort: isDesc ? field : `-${field}` });
  };

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await leadService.createLead(formData);
      toast.success('Lead created successfully! 🎉');
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await leadService.updateLead(editLead._id, formData);
      toast.success('Lead updated successfully!');
      setEditLead(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await leadService.deleteLead(deleteId);
      toast.success('Lead deleted');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await leadService.getLeads({ ...params, limit: 9999 });
      exportToCSV(data.data);
      toast.success(`Exported ${data.data.length} leads to CSV`);
    } catch {
      toast.error('Export failed');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Company' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leads</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">Manage and track all your leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <SearchFilters params={params} onUpdate={updateParams} total={pagination.total} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading leads..." />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Start building your pipeline by adding your first lead."
            action={
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                <Plus size={16} /> Add First Lead
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
                    {columns.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:text-slate-700 dark:hover:text-gray-200 whitespace-nowrap select-none"
                      >
                        {label}
                        <SortIcon field={key} current={params.sort} />
                      </th>
                    ))}
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-gray-800/50">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="table-row-hover group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                            {lead.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lead.name}</p>
                            <p className="text-xs text-slate-400 dark:text-gray-500">{lead.phone || 'No phone'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-gray-400">{lead.email}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-gray-400">{lead.company || '-'}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 font-medium">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/leads/${lead._id}`)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditLead(lead)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(lead._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-4 border-t border-slate-100 dark:border-gray-800">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                limit={parseInt(params.limit)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Lead" size="lg">
        <LeadForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={submitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="lg">
        {editLead && (
          <LeadForm initialData={editLead} onSubmit={handleUpdate} onCancel={() => setEditLead(null)} loading={submitting} />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Lead"
        message="This action cannot be undone. Are you sure you want to permanently delete this lead and all its notes?"
        confirmText="Delete Lead"
        danger
      />
    </div>
  );
};

export default Leads;
