import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
    <p className="text-sm text-slate-500 dark:text-gray-400">{message}</p>
  </div>
);

export const InlineSpinner = ({ size = 16 }) => (
  <Loader2 size={size} className="animate-spin text-indigo-500" />
);

export default LoadingSpinner;
