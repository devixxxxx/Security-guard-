import { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { FileText, Clock, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';

interface HistoryItem {
  id: string;
  type: string;
  title?: string;
  input: string;
  output: string;
  timestamp: string;
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    
    const historyRef = ref(db, `users/${user.uid}/history`);
    
    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: HistoryItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort by newest first
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(items);
      } else {
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this report?')) {
      await remove(ref(db, `users/${user.uid}/history/${id}`));
    }
  };

  const handleDownload = (item: HistoryItem) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(item.output, 180);
    doc.text(splitText, 15, 20);
    doc.save(`${(item.title || item.type).replace(/\s+/g, '_')}_${new Date(item.timestamp).toLocaleDateString()}.pdf`);
  };

  if (loading) return <div className="text-center py-10">Loading history...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Report History</h1>
        <p className="text-slate-600 mt-1">Access your previously generated logs and reports.</p>
      </header>

      {history.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-medium text-slate-900">No history yet</h2>
          <p className="text-slate-500 mt-1">Generated reports will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title || item.type}</h3>
                    <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload(item)} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 rounded bg-blue-50 hover:bg-blue-100"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="pl-12">
                 <details className="mt-2 text-sm text-slate-600 group">
                    <summary className="cursor-pointer hover:text-slate-900 font-medium list-none flex items-center gap-2">
                      <span className="text-blue-600">▶</span> View Output
                    </summary>
                    <div className="mt-3 p-4 bg-slate-50 rounded border border-slate-100 whitespace-pre-wrap font-serif text-slate-800">
                      {item.output}
                    </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
