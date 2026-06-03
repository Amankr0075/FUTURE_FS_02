import { useState } from 'react';
import { Sun, Moon, Monitor, Bell, Shield, Database, Check } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import toast from 'react-hot-toast';

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-gray-800 last:border-0">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>
        {description && <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="flex-shrink-0 ml-4">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-gray-700'}`}
  >
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

const Settings = () => {
  const { darkMode, toggle } = useDarkMode();
  const [notifications, setNotifications] = useState({ email: true, browser: false });
  const [privacy, setPrivacy] = useState({ analytics: true });

  const handleClearCache = () => {
    toast.success('Cache cleared successfully');
  };

  const handleExportData = () => {
    toast.success('Data export started — check your email');
  };

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">Manage your application preferences</p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">Appearance</h2>
        <SettingRow
          icon={darkMode ? Moon : Sun}
          title="Dark Mode"
          description="Switch between light and dark themes"
        >
          <Toggle checked={darkMode} onChange={() => toggle()} />
        </SettingRow>

        <div className="pt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-3">Theme Preview</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Light', icon: Sun, active: !darkMode },
              { label: 'Dark', icon: Moon, active: darkMode },
              { label: 'System', icon: Monitor, active: false },
            ].map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                onClick={() => { if (label === 'Dark' && !darkMode) toggle(); if (label === 'Light' && darkMode) toggle(); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-medium ${
                  active
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:border-slate-300'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <Check size={12} className="text-indigo-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">Notifications</h2>
        <SettingRow
          icon={Bell}
          title="Email Notifications"
          description="Receive email alerts for new leads and updates"
        >
          <Toggle checked={notifications.email} onChange={(v) => setNotifications({ ...notifications, email: v })} />
        </SettingRow>
        <SettingRow
          icon={Bell}
          title="Browser Notifications"
          description="Show desktop push notifications"
        >
          <Toggle checked={notifications.browser} onChange={(v) => setNotifications({ ...notifications, browser: v })} />
        </SettingRow>
      </div>

      {/* Privacy */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">Privacy & Security</h2>
        <SettingRow
          icon={Shield}
          title="Usage Analytics"
          description="Help improve LeadFlow by sharing anonymous usage data"
        >
          <Toggle checked={privacy.analytics} onChange={(v) => setPrivacy({ ...privacy, analytics: v })} />
        </SettingRow>
      </div>

      {/* Data */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">Data Management</h2>
        <SettingRow
          icon={Database}
          title="Clear Cache"
          description="Clear locally cached data and refresh from server"
        >
          <button onClick={handleClearCache} className="btn-secondary text-xs py-1.5">Clear</button>
        </SettingRow>
        <SettingRow
          icon={Database}
          title="Export All Data"
          description="Download all your CRM data in CSV format"
        >
          <button onClick={handleExportData} className="btn-primary text-xs py-1.5">Export</button>
        </SettingRow>
      </div>
    </div>
  );
};

export default Settings;
