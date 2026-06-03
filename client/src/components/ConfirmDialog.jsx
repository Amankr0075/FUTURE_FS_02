import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', danger = true }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 p-6 animate-fade-in">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
          <AlertTriangle size={22} className={danger ? 'text-red-600 dark:text-red-400' : 'text-amber-600'} />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 text-center mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${danger ? 'bg-red-600 hover:bg-red-700 text-white' : 'btn-primary'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
