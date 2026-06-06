import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Home, PenLine, FileText, ClipboardList, CalendarDays, Users, KeyRound, History as HistoryIcon, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/writer', label: 'AI Writer', icon: PenLine },
  { path: '/attendance', label: 'Attendance', icon: ClipboardList },
  { path: '/incident', label: 'Incident Report', icon: FileText },
  { path: '/leave', label: 'Leave App', icon: CalendarDays },
  { path: '/visitor', label: 'Visitor Log', icon: Users },
  { path: '/handover', label: 'Shift Handover', icon: KeyRound },
  { path: '/history', label: 'History', icon: HistoryIcon },
];

export function AppLayout({ isAdminView = false }: { isAdminView?: boolean }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col hidden md:flex shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Guard English AI</h1>
          <p className="text-xs text-slate-400 mt-1">Professional Reports</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {!isAdminView ? NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center px-4 py-2 rounded-md text-sm transition-colors ${
                    pathname === path 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                </Link>
              </li>
            )) : (
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2 rounded-md text-sm transition-colors ${
                    pathname === '/admin' 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  Admin Dashboard
                </Link>
              </li>
            )}
            
            {isAdmin && !isAdminView && (
              <li className="mt-8 border-t border-slate-800 pt-2">
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 rounded-md text-sm text-amber-400 hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  Admin Panel
                </Link>
              </li>
            )}
             {isAdminView && (
              <li className="mt-8 border-t border-slate-800 pt-2">
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Back to App
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400 truncate pr-2">{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50 relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {pathname !== '/dashboard' && pathname !== '/admin' && (
              <Link to="/dashboard" className="p-1.5 -ml-1.5 text-slate-300 hover:text-white rounded-md bg-slate-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <h1 className="font-bold">Guard English AI</h1>
          </div>
          <button onClick={handleLogout} className="p-1 px-2 -mr-2 text-slate-300 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </header>
        
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
