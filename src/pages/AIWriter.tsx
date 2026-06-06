import { useState } from 'react';
import { Send, CheckCircle2, Copy } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { ref, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';

const SYSTEM_PROMPT = `You are a professional English writing assistant for security guards and supervisors.
Convert user messages into professional workplace English suitable for WhatsApp Group Communication, daily updates, or standard reports.
Always maintain:
- Professional Tone
- Correct Grammar
- Respectful Language
- Corporate Format

Do not include conversational filler in your output. Just provide the formatted text.`;

export function AIWriter() {
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
        body: JSON.stringify({ prompt: input, systemPrompt: SYSTEM_PROMPT })
      });
      
      const data = await res.json();
      
      if (res.ok && data.result) {
        setOutput(data.result);
        
        // Save to History
        if (user) {
          const historyRef = push(ref(db, `users/${user.uid}/history`));
          await set(historyRef, {
            type: 'General AI Writer',
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">AI English Writer</h1>
        <p className="text-slate-600 mt-1">Convert Hindi/Odia/local messages into professional English.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
          <label className="font-medium text-slate-700 mb-2 block">Your Message (Any Language)</label>
          <textarea 
            className="w-full flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none outline-none"
            placeholder="e.g., sir aaj ramesh fever ke wajah se duty nahi aaya..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">Generating...</span> : <><Send className="w-5 h-5" /> Generate English</>}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl shadow-sm flex flex-col h-[500px] relative">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-slate-300">Professional Output</label>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className="text-slate-400 hover:text-white disabled:opacity-50 transition-colors p-1"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex-1 p-4 bg-slate-800 rounded-lg overflow-auto border border-slate-700 whitespace-pre-wrap">
            {loading ? (
              <div className="flex space-x-2 animate-pulse p-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-slate-500 italic">Generated text will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
