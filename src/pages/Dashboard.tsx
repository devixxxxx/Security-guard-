import { Link } from 'react-router-dom';
import { PenLine, ClipboardList, FileText, CalendarDays, Users, KeyRound } from 'lucide-react';

const TOOLS = [
  { id: 'writer', name: 'AI Writer', desc: 'Convert general messages to pro English', icon: PenLine, path: '/writer', color: 'bg-blue-500' },
  { id: 'attendance', name: 'Attendance Report', desc: 'Daily attendance format', icon: ClipboardList, path: '/attendance', color: 'bg-emerald-500' },
  { id: 'incident', name: 'Incident Report', desc: 'Professional security incident logs', icon: FileText, path: '/incident', color: 'bg-rose-500' },
  { id: 'leave', name: 'Leave Application', desc: 'Formal leave requests', icon: CalendarDays, path: '/leave', color: 'bg-purple-500' },
  { id: 'visitor', name: 'Visitor Log', desc: 'Record gate entries', icon: Users, path: '/visitor', color: 'bg-amber-500' },
  { id: 'handover', name: 'Shift Handover', desc: 'Secure shift transition notes', icon: KeyRound, path: '/handover', color: 'bg-indigo-500' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Welcome to Guard English AI</h1>
        <p className="text-slate-600 mt-1">Select a tool below to generate your report.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              key={tool.id} 
              to={tool.path}
              className="block group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg text-white ${tool.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
              </div>
              <p className="text-sm text-slate-600">{tool.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
