import { Link } from 'react-router-dom';
import { Home, Zap } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 p-4">
    <div className="text-center max-w-md">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
        <Zap size={36} className="text-white" />
      </div>
      <p className="text-8xl font-black gradient-text mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
