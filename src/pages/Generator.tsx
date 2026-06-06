import { useState } from 'react';
import { Send, CheckCircle2, Copy, Download } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { ref, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import jsPDF from 'jspdf';

const CONFIG = {
  attendance: {
    title: 'Attendance Report',
    desc: 'Generate daily attendance report for WhatsApp or Email.',
    fields: ['Date', 'Shift (Day/Night)', 'Project Name', 'Employee Names/IDs', 'Absentees', 'Remarks'],
    system: 'Convert the input into a professional Security Attendance Report. Format cleanly with bullet points or clear key-value lines. Title it "Daily Attendance Report".'
  },
  incident: {
    title: 'Incident Report',
    desc: 'Log a security issue, theft, or breach professionally.',
    fields: ['Date & Time', 'Location', 'Incident Details', 'Action Taken', 'Reported By'],
    system: 'Convert the input into a formal Security Incident Report. Use professional terminology. Include Date, Time, Location, Description, and Actions Taken.'
  },
  leave: {
    title: 'Leave Application',
    desc: 'Generate a formal leave request.',
    fields: ['Your Name', 'Reason for Leave', 'Dates (From - To)', 'Who will cover duty (if any)'],
    system: 'Convert the input into a formal Leave Application for a security guard or supervisor. Address it professionally.'
  },
  visitor: {
    title: 'Visitor Entry Log',
    desc: 'Format visitor details for daily summary.',
    fields: ['Visitor Name', 'Company/Purpose', 'Met With', 'Time In', 'Time Out'],
    system: 'Convert the input into a clean, easy-to-read Visitor Log entry in professional English.'
  },
  handover: {
    title: 'Shift Handover Report',
    desc: 'Pass crucial info to the next shift.',
    fields: ['Keys Handed Over', 'Pending Issues', 'Special Instructions from Client', 'Equipment Status'],
    system: 'Format the input as a "Shift Handover Report". Ensure all points are bulleted clearly for the relieving guard.'
  }
};

export function Generator({ type }: { type: keyof typeof CONFIG }) {
  const cfg = CONFIG[type];
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, systemPrompt: cfg.system })
      });
      
      const data = await res.json();
      
      if (res.ok && data.result) {
        setOutput(data.result);
        
        let reportTitle = data.result.split('\n')[0].replace(/[*#]/g, '').trim() || cfg.title;
        
        // Save to History
        if (user) {
          const historyRef = push(ref(db, `users/${user.uid}/history`));
          await set(historyRef, {
            type: cfg.title,
            title: reportTitle,
            input,
            output: data.result,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        setOutput('Error: ' + (data.error || 'Failed to generate.'));
      }
    } catch (err) {
      setOutput('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!output) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const splitText = doc.splitTextToSize(output, 180);
    doc.text(splitText, 15, 20);
    
    doc.save(`${cfg.title.replace(/\s+/g, '_')}_Report.pdf`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{cfg.title}</h1>
        <p className="text-slate-600 mt-1">{cfg.desc}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[550px]">
          <div className="mb-4 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100 pb-2">
            <strong>Suggested details to include:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {cfg.fields.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          
          <label className="font-medium text-slate-700 mb-2 block">Raw Details (Any Language)</label>
          <textarea 
            className="w-full flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none outline-none"
            placeholder="Drop your rough notes here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">Formatting Report...</span> : <><Send className="w-5 h-5" /> Generate Report</>}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-sm flex flex-col h-[550px] relative">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-slate-300">Final Report</label>
            <div className="flex gap-2">
              <button 
                onClick={copyToClipboard}
                disabled={!output}
                className="text-slate-400 hover:text-white disabled:opacity-50 transition-colors p-2 bg-slate-800 rounded hover:bg-slate-700"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={downloadPDF}
                disabled={!output}
                className="text-slate-400 hover:text-white disabled:opacity-50 transition-colors p-2 bg-slate-800 rounded hover:bg-slate-700 flex items-center gap-2 text-sm"
                title="Download as PDF"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
          <div className="flex-1 p-5 bg-white text-slate-900 rounded-lg overflow-auto border border-slate-200 whitespace-pre-wrap font-serif text-sm leading-relaxed shadow-inner">
            {loading ? (
              <div className="flex flex-col space-y-4 animate-pulse p-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-slate-400 italic">Your professional report will appear here. Ready to copy/paste or download.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
