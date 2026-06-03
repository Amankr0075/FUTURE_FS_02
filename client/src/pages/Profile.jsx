import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { User, Mail, Shield, Calendar, Save } from 'lucide-react';
import { formatDate, getInitials } from '../utils/helpers';
import { InlineSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authService.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPwd(true);
    try {
      await authService.updatePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password updated successfully!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-gray-800 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold capitalize">
                <Shield size={11} /> {user?.role}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-500 flex items-center gap-1">
                <Calendar size={11} /> Joined {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfile} className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Update Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <InlineSpinner size={14} /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Change Password</h3>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Current Password</label>
            <input
              type="password"
              value={pwdForm.currentPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">New Password</label>
              <input
                type="password"
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                placeholder="Min. 6 characters"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={pwdForm.confirmPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="input-field"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={savingPwd} className="btn-primary">
            {savingPwd ? <InlineSpinner size={14} /> : null}
            {savingPwd ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
