import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, limit, onPageChange }) => {
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages_arr = [];
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift('...');
    if (page + delta < pages - 1) range.push('...');
    pages_arr.push(1);
    range.forEach((r) => pages_arr.push(r));
    if (pages > 1) pages_arr.push(pages);
    return pages_arr;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
      <p className="text-xs text-slate-500 dark:text-gray-400">
        Showing <span className="font-medium text-slate-700 dark:text-gray-300">{start}–{end}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-gray-300">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' ? onPageChange(p) : null}
            disabled={p === '...'}
            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-colors ${
              p === page
                ? 'bg-indigo-600 text-white shadow-sm'
                : p === '...'
                ? 'text-slate-400 cursor-default'
                : 'border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
