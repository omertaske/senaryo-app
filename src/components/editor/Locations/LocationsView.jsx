import { Plus, Trash2, MapPin, Eye, Edit2, X, Image as ImageIcon, ArrowLeft, Upload } from 'lucide-react'; // Upload ikonu eklendi
import { useState, useEffect } from 'react';

// ALT BİLEŞEN: KLAVYE DESTEKLİ Akıllı Öneri İnputu
function SmartInput({ label, value, onChange, suggestions, placeholder }) {
  const [showSugg, setShowSugg] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const safeValue = value || ''; 
  const parts = safeValue.split(',');
  const currentWord = parts[parts.length - 1].trimStart();
  const searchWord = currentWord.trim().toUpperCase();

  const filtered = (searchWord.length > 0 && showSugg) 
    ? suggestions.filter(s => s.name.toUpperCase().includes(searchWord) && s.name.toUpperCase() !== searchWord)
    : [];

  useEffect(() => setSelectedIndex(0), [searchWord]);

  const handleSelect = (selectedName) => {
    parts[parts.length - 1] = (parts[parts.length - 1].startsWith(' ') ? ' ' : '') + selectedName; 
    onChange(parts.join(',') + ', '); 
    setShowSugg(false);
  };

  const handleKeyDown = (e) => {
    if (filtered.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((p) => (p + 1) % filtered.length); } 
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((p) => (p - 1 + filtered.length) % filtered.length); } 
      else if (e.key === 'Enter') { e.preventDefault(); handleSelect(filtered[selectedIndex].name); } 
      else if (e.key === 'Escape') { setShowSugg(false); }
    }
  };

  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">{label}</label>
      <input
        type="text" value={safeValue}
        onChange={(e) => { onChange(e.target.value); setShowSugg(true); }}
        onKeyDown={handleKeyDown} onBlur={() => setTimeout(() => setShowSugg(false), 200)}
        placeholder={placeholder}
        className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500 transition-colors"
      />
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-20 overflow-hidden">
          {filtered.map((s, i) => (
            <div key={s.id} onMouseDown={() => handleSelect(s.name)} className={`px-4 py-2 cursor-pointer text-sm font-bold transition-colors ${i === selectedIndex ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ANA BİLEŞEN
export default function LocationsView({ 
  locations, characters, viewMode, activeLocId, 
  addLocation, updateLocation, deleteLocation, openPreview, openEdit, goBack 
}) {
  const activeLoc = locations.find(l => l.id === activeLocId);

  // FOTOĞRAF YÜKLEME FONKSİYONU
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      updateLocation(activeLoc.id, 'photos', [...(activeLoc.photos || []), base64String]);
    };
    reader.readAsDataURL(file);
  };

  // 1. DÜZENLEME (EDIT) EKRANI
  if (viewMode === 'edit' && activeLoc) {
    return (
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <button onClick={goBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Mekanlara Dön
          </button>
          <button onClick={() => deleteLocation(activeLoc.id)} className="text-red-500 hover:text-red-400 flex items-center gap-2">
            <Trash2 size={20} /> Mekanı Sil
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-400 border-b border-gray-700 pb-2">Sinematografi ve Atmosfer</h3>
            <div className="flex flex-col gap-1"><label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Mekan Adı (Sahne Başlığı)</label><input type="text" value={activeLoc.name} onChange={(e) => updateLocation(activeLoc.id, 'name', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xl font-bold text-white outline-none focus:border-emerald-500 uppercase" placeholder="Örn: KAHVEHANE" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Tür (Setting)</label>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                  {['İÇ', 'DIŞ', 'İÇ/DIŞ'].map(opt => (
                    <button key={opt} onClick={() => updateLocation(activeLoc.id, 'setting', opt)} className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${activeLoc.setting === opt ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>{opt}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1"><label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Genel Zaman</label><input type="text" value={activeLoc.timeOfDay} onChange={(e) => updateLocation(activeLoc.id, 'timeOfDay', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="Örn: Genelde Gece" /></div>
            </div>
            <div className="flex flex-col gap-1"><label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Atmosfer / Hissiyat</label><input type="text" value={activeLoc.atmosphere} onChange={(e) => updateLocation(activeLoc.id, 'atmosphere', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="Örn: Kasvetli, boğucu, sigara dumanlı..." /></div>
            <div className="flex flex-col gap-1"><label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Işık Durumu (Lighting)</label><input type="text" value={activeLoc.lighting} onChange={(e) => updateLocation(activeLoc.id, 'lighting', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="Örn: Titreyen florasan, neon yeşili..." /></div>
            <div className="flex flex-col gap-1"><label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Ses Tasarımı (Soundscape)</label><input type="text" value={activeLoc.soundscape} onChange={(e) => updateLocation(activeLoc.id, 'soundscape', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="Örn: Uzaktan gelen polis sireni, damlayan su..." /></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-400 border-b border-gray-700 pb-2">Dünya İnşası ve Moodboard</h3>
            <div className="flex flex-col gap-1"><label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Dönem / Yıl</label><input type="text" value={activeLoc.period} onChange={(e) => updateLocation(activeLoc.id, 'period', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="Örn: 1990'lar, Günümüz..." /></div>
            <SmartInput label="Bu Mekanda Bulunan Karakterler" value={activeLoc.keyCharacters} onChange={(val) => updateLocation(activeLoc.id, 'keyCharacters', val)} suggestions={characters} placeholder="Karakter seç veya yaz..." />

            {/* YENİ: CİHAZDAN FOTOĞRAF YÜKLEME ALANI (GALERİ GÖRÜNÜMÜ) */}
            <div className="flex flex-col gap-2 pt-4">
              <label className="text-xs text-emerald-400 uppercase tracking-wider font-bold">Moodboard (Referans Görseller)</label>
              <div className="flex gap-3 flex-wrap">
                
                {activeLoc.photos?.map((photo, i) => (
                  <div key={i} className="relative group w-24 h-16 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                    <img src={photo} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => updateLocation(activeLoc.id, 'photos', activeLoc.photos.filter((_, index) => index !== i))} 
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </div>
                ))}

                <label className="w-24 h-16 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-400 hover:bg-emerald-900/20 cursor-pointer transition-all">
                  <Upload size={18} />
                  <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Yükle</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 mt-4">
            <label className="text-xs text-emerald-400 uppercase tracking-wider font-bold block mb-2">Genel Tasvir (Özgür Alan)</label>
            <textarea value={activeLoc.description} onChange={(e) => updateLocation(activeLoc.id, 'description', e.target.value)} className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white outline-none focus:border-emerald-500 resize-none leading-relaxed" placeholder="Yazarın mekana dair hisleri, önemli dekor eşyaları (masadaki kırık küllük vb)..." />
          </div>

        </div>
      </div>
    );
  }

  // 2. ANA EKRAN VE 3. ÖNİZLEME 
  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Mekanlar</h2>
        <button onClick={addLocation} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors">
          <Plus size={20} /> Yeni Mekan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group relative aspect-video flex flex-col shadow-lg">
            
            <button onClick={(e) => { e.stopPropagation(); deleteLocation(loc.id); }} className="absolute top-3 right-3 z-10 bg-red-600/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-red-500 transition-all shadow-lg" title="Mekanı Sil"><Trash2 size={16} /></button>

            <div className="flex-1 bg-gray-900 relative">
              {loc.photos && loc.photos.length > 0 && loc.photos[0] ? (
                <img src={loc.photos[0]} alt={loc.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700"><MapPin size={48} /></div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button onClick={() => openPreview(loc.id)} className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform" title="Önizle"><Eye size={24} /></button>
                <button onClick={() => openEdit(loc.id)} className="bg-emerald-600 text-white p-3 rounded-full hover:scale-110 transition-transform" title="Düzenle"><Edit2 size={24} /></button>
              </div>
              <div className="absolute top-3 left-3 bg-black/80 text-emerald-400 text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                {loc.setting}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-white truncate uppercase flex-1">{loc.name || 'İSİMSİZ MEKAN'}</h3>
              <p className="text-xs text-gray-400 truncate ml-2 max-w-[40%] text-right">{loc.atmosphere || loc.timeOfDay}</p>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'preview' && activeLoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button onClick={goBack} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-900/50 p-2 rounded-full z-10"><X size={20} /></button>
            <div className="h-64 w-full bg-gray-900 relative">
              {activeLoc.photos?.[0] ? (
                 <img src={activeLoc.photos[0]} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><MapPin size={64} className="text-gray-700" /></div>
              )}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-800 to-transparent p-8 pt-20">
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">{activeLoc.setting}</span>
                <h2 className="text-4xl font-bold text-white uppercase drop-shadow-md">{activeLoc.name}</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 text-gray-300">
                <div>
                  {activeLoc.timeOfDay && <p className="mb-2"><strong className="text-emerald-400">Zaman:</strong> {activeLoc.timeOfDay}</p>}
                  {activeLoc.atmosphere && <p className="mb-2"><strong className="text-emerald-400">Atmosfer:</strong> {activeLoc.atmosphere}</p>}
                  {activeLoc.lighting && <p className="mb-2"><strong className="text-emerald-400">Işık:</strong> {activeLoc.lighting}</p>}
                </div>
                <div>
                  {activeLoc.soundscape && <p className="mb-2"><strong className="text-emerald-400">Ses:</strong> {activeLoc.soundscape}</p>}
                  {activeLoc.period && <p className="mb-2"><strong className="text-emerald-400">Dönem:</strong> {activeLoc.period}</p>}
                  {activeLoc.keyCharacters && <p className="mb-2"><strong className="text-emerald-400">Bulunanlar:</strong> {activeLoc.keyCharacters}</p>}
                </div>
              </div>
              {activeLoc.description && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-sm text-emerald-400 uppercase mb-2 font-bold">Mekan Tasviri</h4>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-200">{activeLoc.description}</p>
                </div>
              )}
              <div className="mt-8 flex justify-end">
                <button onClick={() => openEdit(activeLoc.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-colors">
                  <Edit2 size={18} /> Mekanı Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}