import { Plus, Trash2, GripVertical, X, Check, Map } from 'lucide-react';

const COLORS = [
  { name: 'Gri (Standart)', class: 'bg-gray-600' },
  { name: 'Kırmızı (Aksiyon/Kriz)', class: 'bg-red-500' },
  { name: 'Mavi (Aşk/Duygu)', class: 'bg-blue-500' },
  { name: 'Yeşil (Kurulum/Çözüm)', class: 'bg-emerald-500' },
  { name: 'Mor (Gizem/B-Hikayesi)', class: 'bg-purple-500' },
  { name: 'Sarı (Kırılma Noktası)', class: 'bg-amber-500' }
];

export default function BeatsView({
  sequences, addSequence, updateSequenceTitle, deleteSequence, addBeat, 
  updateBeat, deleteBeat, editingBeat, setEditingBeat, 
  handleDragStart, handleDragEnd, handleDrop
}) {
  return (
    <div className="h-full flex flex-col pb-10 animate-in fade-in">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Map className="text-amber-500" /> Mantar Pano (Beat Board)
          </h2>
          <p className="text-gray-400 text-sm mt-1">Hikayenin omurgasını sütunlar ve kartlar ile kurgula. Kartları sürükleyip taşıyabilirsin.</p>
        </div>
        <button onClick={addSequence} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors shadow-lg">
          <Plus size={20} /> Sekans Ekle
        </button>
      </div>

      <div className="flex-1 overflow-x-auto flex gap-6 pb-8 snap-x">
        {sequences.map(seq => (
          <div 
            key={seq.id} 
            className="w-80 flex-shrink-0 bg-gray-900/50 border border-gray-700 rounded-2xl flex flex-col max-h-full snap-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, seq.id)}
          >
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center bg-gray-800/50 rounded-t-2xl group">
              <input 
                type="text" 
                value={seq.title}
                onChange={(e) => updateSequenceTitle(seq.id, e.target.value)}
                className="bg-transparent text-white font-bold uppercase tracking-wider outline-none w-full focus:border-b focus:border-amber-500"
              />
              <button onClick={() => deleteSequence(seq.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {seq.beats.map(beat => (
                <div 
                  key={beat.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, seq.id, beat)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setEditingBeat({ seqId: seq.id, beat })}
                  className="bg-gray-800 border border-gray-600 rounded-xl p-4 cursor-pointer hover:border-amber-500 hover:shadow-lg transition-all group relative"
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${beat.color}`}></div>
                  
                  <div className="pl-2 flex justify-between items-start gap-2">
                    <h4 className="text-white font-bold text-sm leading-tight">{beat.title}</h4>
                    <GripVertical size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 cursor-grab" />
                  </div>
                  {beat.description && (
                    <p className="text-gray-400 text-xs mt-2 line-clamp-3 pl-2">{beat.description}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 pt-2">
              <button onClick={() => addBeat(seq.id)} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors border border-dashed border-gray-600 hover:border-gray-500">
                <Plus size={16} /> Yeni Beat (Olay)
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBeat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl w-full max-w-lg shadow-2xl relative p-6">
            <h3 className="text-xl font-bold text-white mb-4">Olay (Beat) Detayı</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-amber-500 font-bold uppercase">Beat Başlığı</label>
                <input 
                  type="text" value={editingBeat.beat.title}
                  onChange={(e) => setEditingBeat({...editingBeat, beat: {...editingBeat.beat, title: e.target.value}})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white mt-1 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-amber-500 font-bold uppercase">Açıklama / Notlar</label>
                <textarea 
                  value={editingBeat.beat.description}
                  onChange={(e) => setEditingBeat({...editingBeat, beat: {...editingBeat.beat, description: e.target.value}})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white mt-1 outline-none focus:border-amber-500 h-32 resize-none"
                  placeholder="Bu olayda ne yaşanacak? Hangi duygular hakim?"
                />
              </div>

              <div>
                <label className="text-xs text-amber-500 font-bold uppercase mb-2 block">Renk Kodlaması</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button 
                      key={c.class}
                      onClick={() => setEditingBeat({...editingBeat, beat: {...editingBeat.beat, color: c.class}})}
                      className={`w-8 h-8 rounded-full transition-transform ${c.class} ${editingBeat.beat.color === c.class ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button onClick={() => deleteBeat(editingBeat.seqId, editingBeat.beat.id)} className="text-red-500 hover:text-red-400 flex items-center gap-2 text-sm font-bold">
                <Trash2 size={16} /> Kartı Sil
              </button>
              <div className="flex gap-3">
                <button onClick={() => setEditingBeat(null)} className="px-5 py-2 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 font-bold">İptal</button>
                <button onClick={() => updateBeat(editingBeat.seqId, editingBeat.beat)} className="px-5 py-2 rounded-lg text-white bg-amber-600 hover:bg-amber-500 font-bold flex items-center gap-2">
                  <Check size={16} /> Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}