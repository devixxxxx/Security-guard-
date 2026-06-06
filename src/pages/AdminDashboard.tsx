import { useEffect, useState } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Users, FileText, Activity } from 'lucide-react';

interface UserData {
  email: string;
  createdAt: string;
  history?: Record<string, any>;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [stats, setStats] = useState({ totalUsers: 0, totalReports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsers(data);
        
        let reportCount = 0;
        Object.values(data).forEach((user: any) => {
          if (user.history) {
            reportCount += Object.keys(user.history).length;
          }
        });
        
        setStats({
          totalUsers: Object.keys(data).length,
          totalReports: reportCount
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-8">Loading admin panel...</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">System overview and analytics.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Reports Generated</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalReports}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">System Status</p>
            <p className="text-2xl font-bold text-emerald-600">Healthy</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Joined Date</th>
                <th className="px-6 py-3 font-medium">Reports Gen.</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(users).map(([uid, userObj]) => {
                const user = userObj as UserData;
                return (
                <tr key={uid} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.email}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.history ? Object.keys(user.history).length : 0}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                    Active
                  </td>
                </tr>
              )})}

              {Object.keys(users).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
