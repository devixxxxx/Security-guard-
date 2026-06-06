import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { ShieldCheck, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

export function Landing() {
  const { user, loading } = useAuthStore();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Guard English AI</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2">Log in</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors hidden sm:inline-flex">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Write Professional <span className="text-blue-600">English Reports</span> in Seconds.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Convert your local language messages into perfectly formatted, professional English suitable for WhatsApp groups, supervisors, and official logs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-8 py-4 rounded-lg text-lg transition-all shadow-md hover:shadow-lg">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-white border-t border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Conversion</h3>
                <p className="text-slate-600">Type in Hindi, Odia, Bengali, or Hinglish. Get corporate English instantly.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Industry Standard</h3>
                <p className="text-slate-600">Pre-built formats for Attendance, Incident, Handover, and Visitor reports.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Grammar Perfect</h3>
                <p className="text-slate-600">Never worry about spelling mistakes or unprofessional tone again.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© 2026 Guard English AI. Crafted by Bikash Bindhani.</p>
      </footer>
    </div>
  );
}
