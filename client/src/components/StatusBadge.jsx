import clsx from 'clsx';
import { STATUS_COLORS } from '../utils/helpers';

const StatusBadge = ({ status, className = '' }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-600';
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', colorClass, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {status}
    </span>
  );
};

export default StatusBadge;
