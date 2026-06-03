import { useState, useEffect } from 'react';
import { analyticsService } from '../services';
import { SOURCE_CHART_COLORS, STATUS_CHART_COLORS } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { TrendingUp, Users, UserCheck, Target } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const MetricCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnalytics()
      .then(({ data }) => setAnalytics(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  const { summary, leadsBySource, monthlyGrowth, statusDistribution, sourceConversionData } = analytics || {};

  const NoData = () => (
    <div className="h-[250px] flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
      No data available yet. Add leads to see analytics.
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">In-depth insights into your lead pipeline performance</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Leads" value={summary?.totalLeads || 0} icon={Users} color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
        <MetricCard label="Converted" value={summary?.convertedLeads || 0} icon={UserCheck} color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
        <MetricCard label="Conversion Rate" value={`${summary?.conversionRate || 0}%`} icon={TrendingUp} color="bg-gradient-to-br from-violet-500 to-violet-600" sub="of all leads converted" />
        <MetricCard label="Lost Leads" value={summary?.lostLeads || 0} icon={Target} color="bg-gradient-to-br from-rose-500 to-rose-600" />
      </div>

      {/* Monthly Growth Line Chart */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">Monthly Lead Growth</h2>
        <p className="text-xs text-slate-400 dark:text-gray-500 mb-5">Trend of new leads acquired over the last 12 months</p>
        {monthlyGrowth?.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyGrowth} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="transparent" />
              <YAxis tick={{ fontSize: 11 }} stroke="transparent" />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="count" name="Leads" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <NoData />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">Leads by Source</h2>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-4">Which channels drive the most leads</p>
          {leadsBySource?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leadsBySource} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" vertical={false} />
                  <XAxis dataKey="source" tick={{ fontSize: 10 }} stroke="transparent" />
                  <YAxis tick={{ fontSize: 11 }} stroke="transparent" />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }} />
                  <Bar dataKey="count" name="Leads" radius={[6, 6, 0, 0]}>
                    {leadsBySource.map((_, idx) => (
                      <Cell key={idx} fill={SOURCE_CHART_COLORS[idx % SOURCE_CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {leadsBySource.slice(0, 6).map((s, idx) => (
                  <div key={s.source} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SOURCE_CHART_COLORS[idx % SOURCE_CHART_COLORS.length] }} />
                    <span className="text-slate-600 dark:text-gray-400 truncate">{s.source}</span>
                    <span className="ml-auto font-semibold text-slate-700 dark:text-gray-300">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <NoData />}
        </div>

        {/* Status Distribution */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">Status Distribution</h2>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-4">Current pipeline breakdown</p>
          {statusDistribution?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%" cy="50%"
                    outerRadius={80} innerRadius={40}
                    dataKey="count" nameKey="status"
                    paddingAngle={4}
                  >
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }} />
                  <Legend formatter={(val) => <span className="text-xs text-slate-600 dark:text-gray-400">{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : <NoData />}
        </div>
      </div>

      {/* Source Conversion Rates */}
      {sourceConversionData?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">Most Effective Lead Sources</h2>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-5">Conversion rate by source channel</p>
          <div className="space-y-3">
            {sourceConversionData.map((s, idx) => (
              <div key={s.source} className="flex items-center gap-4">
                <div className="w-24 text-xs font-medium text-slate-600 dark:text-gray-400 truncate">{s.source}</div>
                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(s.conversionRate, 100)}%`,
                      background: SOURCE_CHART_COLORS[idx % SOURCE_CHART_COLORS.length],
                    }}
                  />
                </div>
                <div className="w-24 text-right">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{s.conversionRate.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-400 ml-1">({s.converted}/{s.total})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
