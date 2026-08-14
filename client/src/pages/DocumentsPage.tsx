import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { FileUploader } from '../components/documents/FileUploader';
import { QuizViewer } from '../components/documents/QuizViewer';
import { QuizData } from '../types';
import { FileText, Sparkles, HelpCircle, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const DocumentsPage: React.FC = () => {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const { customApiKey } = useAuth();

  const handleFileUpload = (text: string, name: string) => {
    setExtractedText(text);
    setFileName(name);
    setSummary(null);
    setQuiz(null);
  };

  const handleGenerateSummary = async () => {
    if (!extractedText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/pdf/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, customApiKey })
      });
      const data = await res.json();
      setSummary(data.summary);
      toast.success('Document summary generated!');
    } catch (e) {
      toast.error('Failed to summarize document.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!extractedText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/pdf/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, customApiKey })
      });
      const data: QuizData = await res.json();
      setQuiz(data);
      toast.success('Interactive Quiz generated!');
    } catch (e) {
      toast.error('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="Document & PDF Assistant" />

      <main className="p-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Upload Box */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Upload Document & Extract Knowledge</h2>
          <FileUploader onFileUpload={handleFileUpload} />
        </div>

        {/* Document Action Control Center */}
        {extractedText && (
          <div className="p-6 rounded-2xl bg-[#131A27] border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{fileName}</h3>
                  <p className="text-xs text-slate-400">{extractedText.length} characters extracted</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-500/20 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Summarize Document</span>
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Generate Quiz</span>
                </button>
              </div>
            </div>

            {/* Render Summary */}
            {summary && (
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-purple-400 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive AI Summary</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
            )}

            {/* Render Interactive Quiz */}
            {quiz && <QuizViewer quiz={quiz} />}
          </div>
        )}
      </main>
    </div>
  );
};
