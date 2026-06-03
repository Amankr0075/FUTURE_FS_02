import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', description = 'No data to display.', icon: Icon = Inbox, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <Icon size={28} className="text-slate-400 dark:text-gray-500" />
    </div>
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 dark:text-gray-500 max-w-xs mb-6">{description}</p>
    {action && action}
  </div>
);

export default EmptyState;
