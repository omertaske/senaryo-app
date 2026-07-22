import { BookOpen, Type } from 'lucide-react';

export default function TreatmentView({ text, handleUpdate }) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const pageCount = Math.max(1, Math.ceil(wordCount / 300)); // Tretman standardı sayfada ~300 kelime

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col pb-10 animate-in fade-in">
      
      {/* İnce ve Zarif Üst Bar */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3 text-white">
          <BookOpen className="text-purple-400" size={28} />
          <h2 className="text-2xl font-light tracking-widest uppercase">Tretman</h2>
        </div>
        
        <div className="text-xs text-gray-500 flex gap-6 font-mono">
          <span className="flex items-center gap-2"><Type size={14}/> {wordCount} Kelime</span>
          <span>Tahmini {pageCount} Sayfa</span>
        </div>
      </div>
      
      {/* Odaklanmış Karanlık Yazım Alanı */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-10 md:p-16 flex-1 flex flex-col shadow-inner backdrop-blur-sm">
        <textarea 
          className="flex-1 w-full bg-transparent text-gray-300 text-lg md:text-xl outline-none resize-none leading-loose placeholder-gray-700 font-serif selection:bg-purple-900 selection:text-white"
          placeholder="Kamera açılarının veya diyalogların olmadığı, hikayenin roman akıcılığında anlatıldığı edebi geniş özet... &#10;&#10;1. Perde kurulumuyla başla..."
          value={text}
          onChange={(e) => handleUpdate(e.target.value)}
        />
      </div>
    </div>
  );
}