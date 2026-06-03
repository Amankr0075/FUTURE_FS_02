export const STATUS_COLORS = {
  'New': 'badge-new',
  'Contacted': 'badge-contacted',
  'Qualified': 'badge-qualified',
  'Proposal Sent': 'badge-proposal',
  'Converted': 'badge-converted',
  'Lost': 'badge-lost',
};

export const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];
export const SOURCE_OPTIONS = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Advertisement', 'Trade Show', 'Other'];

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

export const exportToCSV = (leads) => {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created At'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.phone || '',
    lead.company || '',
    lead.source || '',
    lead.status,
    formatDate(lead.createdAt),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export const SOURCE_CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
];

export const STATUS_CHART_COLORS = {
  'New': '#3b82f6',
  'Contacted': '#f59e0b',
  'Qualified': '#8b5cf6',
  'Proposal Sent': '#f97316',
  'Converted': '#10b981',
  'Lost': '#ef4444',
};
