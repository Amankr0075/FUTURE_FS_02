import { Menu, Bell, Sun, Moon, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getInitials } from '../utils/helpers';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggle } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-400 lg:hidden transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title area */}
      <div className="flex-1">
        <div className="relative max-w-sm hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-gray-300 placeholder-slate-400"
            onFocus={() => navigate('/leads')}
            readOnly
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-400 transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-400 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-gray-700 mx-1" />

        {/* User avatar */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name)}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300 hidden sm:block">{user?.name?.split(' ')[0]}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
