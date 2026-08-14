import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  onFileUpload: (fileText: string, fileName: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File exceeds 10MB limit.');
      return;
    }

    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileUpload(text, file.name);
      setLoading(false);
      toast.success(`Successfully uploaded ${file.name}`);
    };
    reader.onerror = () => {
      setLoading(false);
      toast.error('Failed to read file content.');
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer p-8 rounded-2xl border-2 border-dashed transition-all duration-200 text-center ${
        dragActive 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
      }`}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept=".txt,.pdf,.md,.csv,.json,.doc,.docx" 
        className="hidden" 
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />
      
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {fileName ? `Selected: ${fileName}` : 'Click or drag file to upload'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports PDF, DOCX, TXT, MD, CSV (Up to 10MB)
          </p>
        </div>
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Extracting document text...</span>
          </div>
        )}
      </div>
    </div>
  );
};
