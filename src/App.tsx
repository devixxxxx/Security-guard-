/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/auth';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { AIWriter } from './pages/AIWriter';
import { Generator } from './pages/Generator';
import { History } from './pages/History';
import { AdminDashboard } from './pages/AdminDashboard';
import { AppLayout } from './components/AppLayout';

function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useAuthStore();

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-primary animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;

  return <Outlet />;
}

export default function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsub;
  }, [setUser, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/writer" element={<AIWriter />} />
            <Route path="/attendance" element={<Generator type="attendance" />} />
            <Route path="/incident" element={<Generator type="incident" />} />
            <Route path="/leave" element={<Generator type="leave" />} />
            <Route path="/visitor" element={<Generator type="visitor" />} />
            <Route path="/handover" element={<Generator type="handover" />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<AppLayout isAdminView />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

