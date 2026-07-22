import { Plus, GripVertical, Trash2 } from 'lucide-react';

export default function BeatsView({
  sequences,
  addSequence,
  addBeat,
  updateBeat,
  deleteBeat,
  onDragStart,
  onDrop,
  onDragOver
}) {
  return (
    <div className="h-full flex flex-col pb-10">
      
      {/* Üst Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Sekans / Beat Panosu</h2>
        <button 
          onClick={addSequence}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Yeni Sekans
        </button>
      </div>

      {/* Mantar Pano Alanı (Kanban Board Görünümü) */}
      <div className="flex gap-6 overflow-x-auto pb-8 flex-1 items-start">
        
        {sequences.map(seq => (
          <div 
            key={seq.id}
            onDrop={(e) => onDrop(e, seq.id)} // Bırakma olayını dinle
            onDragOver={onDragOver} // Üzerine gelinmesine izin ver
            className="bg-gray-800 border border-gray-700 min-w-[320px] w-[320px] rounded-xl flex flex-col shrink-0 max-h-full"
          >
            {/* Sütun Başlığı */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-xl">
              <h3 className="font-bold text-lg text-indigo-300">{seq.title}</h3>
              <button 
                onClick={() => addBeat(seq.id)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                title="Yeni Beat Ekle"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Kartların Dizildiği Alan */}
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              
              {seq.beats.map(beat => (
                <div 
                  key={beat.id}
                  draggable // HTML5 Büyüsü: Bu elementi sürüklenebilir yapar!
                  onDragStart={(e) => onDragStart(e, seq.id, beat.id)}
                  className="bg-gray-700 border border-gray-600 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-colors group relative shadow-md"
                >
                  {/* Kart Silme Butonu */}
                  <button 
                    onClick={() => deleteBeat(seq.id, beat.id)} 
                    className="absolute top-3 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  {/* Kart Başlığı */}
                  <div className="flex items-center gap-2 mb-3 pr-6">
                    <GripVertical size={16} className="text-gray-400" />
                    <input 
                      type="text" 
                      value={beat.title}
                      onChange={(e) => updateBeat(seq.id, beat.id, 'title', e.target.value)}
                      className="bg-transparent font-bold text-white outline-none border-b border-transparent focus:border-indigo-500 w-full placeholder-gray-400"
                      placeholder="Beat Başlığı (Örn: Çatışma)"
                    />
                  </div>
                  
                  {/* Kart İçeriği (Olay Örgüsü) */}
                  <textarea 
                    value={beat.content}
                    onChange={(e) => updateBeat(seq.id, beat.id, 'content', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-24"
                    placeholder="Bu beat'te ne oluyor? Olay örgüsünü özetle..."
                  />
                </div>
              ))}
              
              {/* Sütun Boşsa Çıkacak Uyarı */}
              {seq.beats.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
                  Bu sekans boş. <br/> Yukarıdaki + butonuna basarak beat ekle.
                </div>
              )}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}