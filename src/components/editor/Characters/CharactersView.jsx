import { Plus, Trash2, User, Eye, Edit2, X, Image as ImageIcon, ArrowLeft, Upload } from 'lucide-react'; // Upload ikonu eklendi
import { useState, useEffect } from 'react';

// ALT BİLEŞEN: KLAVYE DESTEKLİ Akıllı Öneri İnputu (Burası aynı)
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
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % filtered.length); } 
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length); } 
      else if (e.key === 'Enter') { e.preventDefault(); handleSelect(filtered[selectedIndex].name); } 
      else if (e.key === 'Escape') { setShowSugg(false); }
    }
  };

  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">{label}</label>
      <input
        type="text" value={safeValue} onChange={(e) => { onChange(e.target.value); setShowSugg(true); }}
        onKeyDown={handleKeyDown} onBlur={() => setTimeout(() => setShowSugg(false), 200)}
        placeholder={placeholder}
        className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
      />
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-20 overflow-hidden">
          {filtered.map((s, i) => (
            <div key={s.id} onMouseDown={() => handleSelect(s.name)} className={`px-4 py-2 cursor-pointer text-sm font-bold transition-colors ${i === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ANA BİLEŞEN
export default function CharactersView({ 
  characters, locations, viewMode, activeCharId, 
  addCharacter, updateCharacter, deleteCharacter, openPreview, openEdit, goBack 
}) {
  const activeChar = characters.find(c => c.id === activeCharId);

  // FOTOĞRAF YÜKLEME FONKSİYONU
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Fotoğrafı bilgisayardan okuyup veritabanı diline (Base64) çeviriyoruz
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      updateCharacter(activeChar.id, 'photos', [...(activeChar.photos || []), base64String]);
    };
    reader.readAsDataURL(file);
  };

  // 1. DÜZENLEME (EDIT) EKRANI
  if (viewMode === 'edit' && activeChar) {
    return (
      <div className="max-w-4xl mx-auto pb-20 animate-in fade-in">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <button onClick={goBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Karakterlere Dön
          </button>
          <button onClick={() => deleteCharacter(activeChar.id)} className="text-red-500 hover:text-red-400 flex items-center gap-2">
            <Trash2 size={20} /> Karakteri Sil
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-400 border-b border-gray-700 pb-2">Kimlik Bilgileri</h3>
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Karakter Adı</label><input type="text" value={activeChar.name} onChange={(e) => updateCharacter(activeChar.id, 'name', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xl font-bold text-white outline-none focus:border-blue-500" placeholder="Örn: HAKAN" /></div>
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Rolü / Mesleği</label><input type="text" value={activeChar.profession} onChange={(e) => updateCharacter(activeChar.id, 'profession', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Örn: Ana Karakter / Polis" /></div>
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Nereli / Kökeni</label><input type="text" value={activeChar.origin} onChange={(e) => updateCharacter(activeChar.id, 'origin', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Örn: İstanbul doğumlu, eski asker" /></div>
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Amacı (Hikayedeki Hedefi)</label><input type="text" value={activeChar.goal} onChange={(e) => updateCharacter(activeChar.id, 'goal', e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="Örn: İntikam almak" /></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-400 border-b border-gray-700 pb-2">İlişkiler ve Görsel</h3>
            <SmartInput label="Eşi / Sevgilisi" value={activeChar.spouse} onChange={(val) => updateCharacter(activeChar.id, 'spouse', val)} suggestions={characters} placeholder="Karakter seç veya yaz..." />
            <SmartInput label="Dostları / Müttefikleri" value={activeChar.friends} onChange={(val) => updateCharacter(activeChar.id, 'friends', val)} suggestions={characters} placeholder="Karakter seç veya yaz..." />
            <SmartInput label="Düşmanları / Rakipleri" value={activeChar.enemies} onChange={(val) => updateCharacter(activeChar.id, 'enemies', val)} suggestions={characters} placeholder="Karakter seç veya yaz..." />
            <SmartInput label="Yaşadığı / Sık Bulunduğu Mekan" value={activeChar.residence} onChange={(val) => updateCharacter(activeChar.id, 'residence', val)} suggestions={locations} placeholder="Mekan yazın..." />

            {/* YENİ: CİHAZDAN FOTOĞRAF YÜKLEME ALANI (GALERİ GÖRÜNÜMÜ) */}
            <div className="flex flex-col gap-2 pt-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Karakter Fotoğrafları</label>
              <div className="flex gap-3 flex-wrap">
                
                {/* Yüklü olan fotoğrafları göster */}
                {activeChar.photos?.map((photo, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                    <img src={photo} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => updateCharacter(activeChar.id, 'photos', activeChar.photos.filter((_, index) => index !== i))} 
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </div>
                ))}

                {/* Yükleme Butonu */}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400 hover:bg-blue-900/20 cursor-pointer transition-all">
                  <Upload size={20} />
                  <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Yükle</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-2">Serbest Notlar (Özgür Alan)</label>
            <textarea value={activeChar.description} onChange={(e) => updateCharacter(activeChar.id, 'description', e.target.value)} className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white outline-none focus:border-blue-500 resize-none leading-relaxed" placeholder="Karakterin psikolojisi, travmaları, tikleri, tarzı... İstediğin gibi yaz." />
          </div>

        </div>
      </div>
    );
  }

  // 2. ANA EKRAN VE 3. ÖNİZLEME (Buralar tamamen aynı kalıyor, sadece Grid kısmındaki silme butonunu dahil ettim)
  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Karakterler</h2>
        <button onClick={addCharacter} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors">
          <Plus size={20} /> Yeni Karakter
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div key={char.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group relative aspect-[3/4] flex flex-col shadow-lg">
            
            <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="absolute top-3 right-3 z-10 bg-red-600/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-red-500 transition-all shadow-lg" title="Karakteri Sil"><Trash2 size={16} /></button>

            <div className="flex-1 bg-gray-900 relative">
              {char.photos && char.photos.length > 0 && char.photos[0] ? (
                <img src={char.photos[0]} alt={char.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600"><User size={64} /></div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button onClick={() => openPreview(char.id)} className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform" title="Önizle"><Eye size={24} /></button>
                <button onClick={() => openEdit(char.id)} className="bg-blue-600 text-white p-3 rounded-full hover:scale-110 transition-transform" title="Düzenle"><Edit2 size={24} /></button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 text-center bg-gray-800">
              <h3 className="font-bold text-lg text-white truncate uppercase">{char.name || 'İSİMSİZ'}</h3>
              <p className="text-xs text-blue-400 truncate mt-1">{char.profession || char.role || 'Rol belirtilmedi'}</p>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'preview' && activeChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-gray-800 border border-gray-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button onClick={goBack} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-900 p-2 rounded-full"><X size={20} /></button>
            <div className="p-8">
              <div className="flex items-center gap-6 mb-6 border-b border-gray-700 pb-6">
                <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-blue-500">
                  {activeChar.photos?.[0] ? <img src={activeChar.photos[0]} className="w-full h-full object-cover" /> : <User size={40} className="m-auto h-full text-gray-500" />}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white uppercase">{activeChar.name}</h2>
                  <p className="text-blue-400 text-lg">{activeChar.profession}</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-300">
                {activeChar.goal && <p><strong>Amacı:</strong> {activeChar.goal}</p>}
                {activeChar.origin && <p><strong>Kökeni:</strong> {activeChar.origin}</p>}
                {activeChar.spouse && <p><strong>Eşi / Sevgilisi:</strong> {activeChar.spouse}</p>}
                {activeChar.friends && <p><strong>Dostları:</strong> {activeChar.friends}</p>}
                {activeChar.enemies && <p><strong>Düşmanları:</strong> {activeChar.enemies}</p>}
                {activeChar.residence && <p><strong>Mekan:</strong> {activeChar.residence}</p>}
                {activeChar.description && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-sm text-gray-400 uppercase mb-2 font-bold">Karakter Notları</h4>
                    <p className="whitespace-pre-wrap leading-relaxed text-gray-200">{activeChar.description}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => openEdit(activeChar.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-colors">
                  <Edit2 size={18} /> Detayları Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}