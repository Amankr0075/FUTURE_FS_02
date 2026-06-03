import { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../utils/helpers';

const SearchFilters = ({ params, onUpdate, total }) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = params.status || params.source || params.search || params.startDate || params.endDate;

  const clearFilters = () => {
    onUpdate({ search: '', status: '', source: '', startDate: '', endDate: '' });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={params.search || ''}
            onChange={(e) => onUpdate({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-gray-300 placeholder-slate-400"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300'
              : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter size={15} />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
          <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200">
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-slate-100 dark:border-gray-700 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Status</label>
            <select
              value={params.status || ''}
              onChange={(e) => onUpdate({ status: e.target.value })}
              className="input-field text-sm"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Source</label>
            <select
              value={params.source || ''}
              onChange={(e) => onUpdate({ source: e.target.value })}
              className="input-field text-sm"
            >
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">From Date</label>
            <input
              type="date"
              value={params.startDate || ''}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">To Date</label>
            <input
              type="date"
              value={params.endDate || ''}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              className="input-field text-sm"
            />
          </div>
        </div>
      )}

      {/* Results counter */}
      {total !== undefined && (
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Showing <span className="font-semibold text-slate-700 dark:text-gray-300">{total}</span> lead{total !== 1 ? 's' : ''}
          {hasActiveFilters && ' matching your filters'}
        </p>
      )}
    </div>
  );
};

export default SearchFilters;
