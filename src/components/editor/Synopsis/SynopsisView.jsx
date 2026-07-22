import { Clock, Type } from 'lucide-react';

export default function SynopsisView({ text, handleUpdate }) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-10 animate-in fade-in">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-main tracking-tight font-serif">Sinopsis</h2>
          <p className="text-muted text-sm mt-2 font-mono uppercase tracking-widest">Hikayenin Çekirdeği. Yönetmenin İlk Okuyacağı Özet.</p>
        </div>
        <div className="flex gap-4 bg-panel px-5 py-3 rounded-xl border border-border shadow-md">
          <div className="flex items-center gap-2 text-sm text-main font-semibold"><Type size={16} className="text-accent"/> {wordCount} Kelime</div>
          <div className="flex items-center gap-2 text-sm text-main font-semibold border-l border-border pl-4"><Clock size={16} className="text-accent"/> ~{readTime} Dk Okuma</div>
        </div>
      </div>
      
      {/* Kağıt Dokulu Edebi Yazım Alanı */}
      <div className="bg-panel border border-border rounded-2xl p-12 flex-1 flex flex-col shadow-2xl relative group focus-within:border-accent transition-colors">
        <textarea 
          className="flex-1 w-full bg-transparent text-main text-xl outline-none resize-none leading-loose placeholder-muted font-serif"
          placeholder="Bu hikaye ne hakkında? Ana karakter kim, ne istiyor ve önündeki en büyük engel ne?&#10;&#10;Sinopsis metnini buraya yazmaya başla..."
          value={text}
          onChange={(e) => handleUpdate(e.target.value)}
        />
      </div>
    </div>
  );
}