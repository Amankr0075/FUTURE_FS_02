import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, TrendingUp, UserCheck, UserX, Plus, ArrowRight,
  BarChart3, Star, Activity, Clock,
} from 'lucide-react';
import { analyticsService, leadService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo, STATUS_CHART_COLORS } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const StatCard = ({ label, value, icon: Icon, color, change }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 font-medium ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% this month
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await analyticsService.getAnalytics();
        setAnalytics(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const { summary, leadsBySource, monthlyGrowth, statusDistribution, recentLeads } = analytics || {};

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

  const statCards = [
    { label: 'Total Leads', value: summary?.totalLeads || 0, icon: Users, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
    { label: 'New Leads', value: summary?.newLeads || 0, icon: Activity, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { label: 'Converted', value: summary?.convertedLeads || 0, icon: UserCheck, color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { label: 'Conversion Rate', value: `${summary?.conversionRate || 0}%`, icon: TrendingUp, color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
    { label: 'Contacted', value: summary?.contactedLeads || 0, icon: Star, color: 'bg-gradient-to-br from-amber-500 to-amber-600' },
    { label: 'Lost Leads', value: summary?.lostLeads || 0, icon: UserX, color: 'bg-gradient-to-br from-rose-500 to-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">Here's what's happening with your leads today.</p>
        </div>
        <button onClick={() => navigate('/leads')} className="btn-primary">
          <Plus size={16} />
          Add New Lead
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Growth Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Monthly Lead Growth</h2>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Last 12 months</p>
            </div>
          </div>
          {monthlyGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="transparent" />
                <YAxis tick={{ fontSize: 11 }} stroke="transparent" />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" name="Leads" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">No data yet. Add leads to see growth chart.</div>
          )}
        </div>

        {/* Status Distribution Pie */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">Lead Status</h2>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-4">Distribution by status</p>
          {statusDistribution?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" nameKey="status" paddingAngle={3}>
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {statusDistribution.slice(0, 4).map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: STATUS_CHART_COLORS[s.status] }} />
                      <span className="text-slate-600 dark:text-gray-400">{s.status}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-gray-300">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads By Source Bar Chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">Leads by Source</h2>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-4">Which channels drive the most leads</p>
          {leadsBySource?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadsBySource} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" vertical={false} />
                <XAxis dataKey="source" tick={{ fontSize: 11 }} stroke="transparent" />
                <YAxis tick={{ fontSize: 11 }} stroke="transparent" />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }} />
                <Bar dataKey="count" name="Leads" radius={[6, 6, 0, 0]}>
                  {leadsBySource.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No source data yet</div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Recent Leads</h2>
            <Link to="/leads" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentLeads?.length > 0 ? (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                    {lead.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{lead.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500">{formatTimeAgo(lead.createdAt)}</p>
                  </div>
                  <StatusBadge status={lead.status} className="text-[10px] py-0.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Clock size={28} className="mx-auto mb-2 opacity-40" />
              No leads yet
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <Plus size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Add New Lead</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">Create a new lead entry</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-800 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <Users size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-violet-700 dark:group-hover:text-violet-300">View All Leads</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">Manage your pipeline</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">View Analytics</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">Insights & reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
