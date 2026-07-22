import { Clock, Type } from 'lucide-react';

export default function SynopsisView({ text, handleUpdate }) {
  // İstatistik hesaplamaları
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200); // Ortalama okuma hızı dakikada 200 kelimedir.

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-10 animate-in fade-in">
      
      {/* Üst Bar ve İstatistikler */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sinopsis</h2>
          <p className="text-gray-400 text-sm mt-1">Hikayenin çekirdeği. Yapımcının ilk okuyacağı özet.</p>
        </div>
        <div className="flex gap-4 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Type size={16} className="text-blue-400"/> {wordCount} Kelime
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 border-l border-gray-600 pl-4">
            <Clock size={16} className="text-emerald-400"/> ~{readTime} Dk Okuma
          </div>
        </div>
      </div>
      
      {/* Şık A4 Görünümü */}
      <div className="bg-gray-100 rounded-sm p-12 flex-1 flex flex-col shadow-2xl relative">
        <textarea 
          className="flex-1 w-full bg-transparent text-gray-900 text-xl outline-none resize-none leading-relaxed placeholder-gray-400 font-serif"
          placeholder="Bu hikaye ne hakkında? Ana karakter kim, ne istiyor ve önündeki en büyük engel ne?&#10;&#10;Sinopsis metnini buraya yazmaya başla..."
          value={text}
          onChange={(e) => handleUpdate(e.target.value)}
        />
      </div>
    </div>
  );
}