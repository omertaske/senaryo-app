import { BookOpen, Type } from 'lucide-react';

export default function TreatmentView({ text, handleUpdate }) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const pageCount = Math.max(1, Math.ceil(wordCount / 300));

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pb-10 animate-in fade-in">
      
      <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-4 text-main">
          <div className="bg-accent/10 p-3 rounded-full"><BookOpen className="text-accent" size={28} /></div>
          <h2 className="text-3xl font-bold tracking-widest uppercase font-serif">Tretman</h2>
        </div>
        <div className="text-xs text-muted flex gap-6 font-mono bg-panel px-4 py-2 rounded-lg border border-border">
          <span className="flex items-center gap-2 font-bold"><Type size={14} className="text-accent"/> {wordCount} Kelime</span>
          <span className="font-bold">Tahmini {pageCount} Sayfa</span>
        </div>
      </div>
      
      <div className="bg-panel border border-border rounded-3xl p-12 md:p-16 flex-1 flex flex-col shadow-[0_10px_50px_rgba(0,0,0,0.2)] focus-within:ring-2 ring-accent/50 transition-all">
        <textarea 
          className="flex-1 w-full bg-transparent text-main text-lg md:text-xl outline-none resize-none leading-loose placeholder-muted font-serif"
          placeholder="Kamera açılarının veya diyalogların olmadığı, hikayenin roman akıcılığında anlatıldığı edebi geniş özet... &#10;&#10;1. Perde kurulumuyla başla..."
          value={text}
          onChange={(e) => handleUpdate(e.target.value)}
        />
      </div>
    </div>
  );
}