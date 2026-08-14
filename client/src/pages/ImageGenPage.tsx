import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Image as ImageIcon, Sparkles, Download, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const ImageGenPage: React.FC = () => {
  const [prompt, setPrompt] = useState('A futuristic high-tech AI developer workspace in neon dark mode, 8k render, glassmorphism UI');
  const [images, setImages] = useState<{ url: string; prompt: string }[]>([
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', prompt: 'Glassmorphism UI background' }
  ]);
  const [loading, setLoading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const { customApiKey } = useAuth();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, customApiKey })
      });
      const data = await res.json();
      setImages([{ url: data.imageUrl, prompt: data.prompt }, ...images]);
      toast.success('Generated new image asset!');
    } catch (e) {
      toast.error('Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#0B0F17] pb-12">
      <Header title="AI Image Generation Studio" />

      <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Prompt Input Form */}
        <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-[#131A27] border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <ImageIcon className="w-4 h-4 text-rose-400" />
            <span>Text-to-Image Prompt Studio</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe image prompt (e.g. Minimalist Apple design laptop icon, 3D abstract render)..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Rendering Visual...' : 'Generate Image'}</span>
            </button>
          </div>
        </form>

        {/* Image History Gallery */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide">Generated Asset Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden bg-[#131A27] border border-slate-800 space-y-2">
                <img src={img.url} alt={img.prompt} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3">
                  <p className="text-xs text-slate-300 truncate">{img.prompt}</p>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setLightboxUrl(img.url)}
                    className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                    title="Preview Lightbox"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <a
                    href={img.url}
                    target="_blank"
                    download="generated_asset.jpg"
                    className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                    title="Download Asset"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div onClick={() => setLightboxUrl(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <img src={lightboxUrl} alt="Preview" className="max-w-4xl max-h-[85vh] rounded-2xl border border-slate-800 shadow-2xl object-contain" />
        </div>
      )}
    </div>
  );
};
