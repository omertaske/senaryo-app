import { Plus, Trash2, ArrowLeft, Upload, Archive, Car, BookOpen, Music, Search, Edit2, PlayCircle } from 'lucide-react';

export default function CatalogView({
  catalogs, filter, setFilter, viewMode, activeItemId,
  addItem, updateItem, deleteItem, openEdit, goBack
}) {
  const activeItem = catalogs.find(c => c.id === activeItemId);

  const getCategoryDetails = (cat) => {
    switch(cat) {
      case 'prop': return { icon: <Archive size={16} />, label: 'Eşya / Obje', color: 'text-amber-400', bg: 'bg-amber-400/20' };
      case 'vehicle': return { icon: <Car size={16} />, label: 'Araç / Taşıt', color: 'text-blue-400', bg: 'bg-blue-400/20' };
      case 'lore': return { icon: <BookOpen size={16} />, label: 'Evren Kuralı', color: 'text-purple-400', bg: 'bg-purple-400/20' };
      case 'music': return { icon: <Music size={16} />, label: 'Müzik / Ses', color: 'text-pink-400', bg: 'bg-pink-400/20' };
      default: return { icon: <Archive size={16} />, label: 'Bilinmeyen', color: 'text-gray-400', bg: 'bg-gray-400/20' };
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateItem(activeItem.id, 'photos', [...(activeItem.photos || []), reader.result]);
    };
    reader.readAsDataURL(file);
  };

  // YENİ: BİLGİSAYARDAN SES/MÜZİK YÜKLEME
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      // Sesi veritabanına uyumlu base64'e çevirip mediaLink'e yazıyoruz
      updateItem(activeItem.id, 'mediaLink', reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (viewMode === 'edit' && activeItem) {
    const details = getCategoryDetails(activeItem.category);
    
    return (
      <div className="max-w-4xl mx-auto pb-20 animate-in fade-in">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <button onClick={goBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Kataloğa Dön
          </button>
          <button onClick={() => deleteItem(activeItem.id)} className="text-red-500 hover:text-red-400 flex items-center gap-2">
            <Trash2 size={20} /> Öğeyi Sil
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex gap-4 mb-8">
            <div className={`p-4 rounded-xl flex items-center justify-center ${details.bg} ${details.color}`}>
              {details.icon}
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                value={activeItem.name} 
                onChange={(e) => updateItem(activeItem.id, 'name', e.target.value)} 
                className="bg-transparent text-3xl font-bold text-white uppercase tracking-wider outline-none w-full border-b border-gray-700 focus:border-white pb-2" 
                placeholder="ÖĞENİN ADINI GİRİN (Örn: SİLAH)" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Kategori</label>
                <div className="grid grid-cols-2 gap-2">
                  {['prop', 'vehicle', 'lore', 'music'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => updateItem(activeItem.id, 'category', cat)} 
                      className={`py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${activeItem.category === cat ? getCategoryDetails(cat).bg + ' ' + getCategoryDetails(cat).color + ' border border-current' : 'bg-gray-900 text-gray-500 hover:text-gray-300'}`}
                    >
                      {getCategoryDetails(cat).icon} {getCategoryDetails(cat).label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Hikayedeki Önemi</label>
                <select 
                  value={activeItem.importance} 
                  onChange={(e) => updateItem(activeItem.id, 'importance', e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 appearance-none font-semibold cursor-pointer"
                >
                  <option value="Kritik">Kritik (Hikayeyi değiştirir)</option>
                  <option value="Normal">Normal (Detay katar)</option>
                  <option value="Arka Plan">Arka Plan (Atmosfer içindir)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Görsel / Referans</label>
                <div className="flex gap-3 flex-wrap">
                  {activeItem.photos?.map((photo, i) => (
                    <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                      <img src={photo} alt="Referans" className="w-full h-full object-cover" />
                      <button onClick={() => updateItem(activeItem.id, 'photos', activeItem.photos.filter((_, index) => index !== i))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><Trash2 size={20}/></button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-gray-700 cursor-pointer transition-all">
                    <Upload size={20} />
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-wider">Resim</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* YENİ VE GELİŞMİŞ MULTİMEDYA ALANI */}
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-700">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-bold flex items-center gap-2 mb-2">
                <Music size={14} className="text-pink-400"/> Multimedya / Müzik Linki VEYA Dosyası
              </label>
              
              <div className="flex gap-3 items-center">
                <input 
                  type="text" 
                  value={activeItem.mediaLink || ''} 
                  onChange={(e) => updateItem(activeItem.id, 'mediaLink', e.target.value)} 
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white outline-none focus:border-pink-500 transition-colors" 
                  placeholder="YouTube linki yapıştırın VEYA yandaki butondan dosya seçin..." 
                />
                
                {/* BİLGİSAYARDAN YÜKLE BUTONU */}
                <label className="bg-pink-600/20 hover:bg-pink-600 hover:text-white text-pink-400 border border-pink-500/50 px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition-all font-bold text-sm shadow-lg whitespace-nowrap">
                  <Upload size={16} /> Bilgisayardan Ses Yükle
                  <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                </label>
              </div>

              {/* Yüklenen Sesi Test Etmek İçin Player */}
              {activeItem.mediaLink && activeItem.mediaLink.startsWith('data:audio') && (
                <div className="mt-4 bg-gray-900 p-3 rounded-lg flex items-center gap-4 border border-gray-700">
                  <PlayCircle className="text-pink-500" size={24} />
                  <audio controls className="w-full h-8" src={activeItem.mediaLink} />
                </div>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-2">Detaylı Açıklama / Tarihçe</label>
              <textarea 
                value={activeItem.description} 
                onChange={(e) => updateItem(activeItem.id, 'description', e.target.value)} 
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-5 text-gray-200 outline-none focus:border-white resize-none leading-relaxed text-lg font-serif" 
                placeholder="Bu eşyanın veya kuralın hikayesi nedir?..." 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredCatalogs = filter === 'all' ? catalogs : catalogs.filter(c => c.category === filter);

  return (
    <div className="max-w-6xl mx-auto pb-20 relative animate-in fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">Katalog (Asset Library)</h2>
          <p className="text-gray-400 text-sm mt-1">Prodüksiyon aşamasında kullanılacak obje ve müzikleri burada toplayın.</p>
        </div>
        <button onClick={addItem} className="bg-white hover:bg-gray-200 text-black px-5 py-3 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg">
          <Plus size={20} /> Yeni Öğe
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-800 pb-6 mb-8 overflow-x-auto">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>Tümü</button>
        <button onClick={() => setFilter('prop')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${filter === 'prop' ? 'bg-amber-400/20 text-amber-400 border border-amber-400/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}><Archive size={14}/> Eşyalar</button>
        <button onClick={() => setFilter('vehicle')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${filter === 'vehicle' ? 'bg-blue-400/20 text-blue-400 border border-blue-400/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}><Car size={14}/> Araçlar</button>
        <button onClick={() => setFilter('lore')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${filter === 'lore' ? 'bg-purple-400/20 text-purple-400 border border-purple-400/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}><BookOpen size={14}/> Evren Kuralları</button>
        <button onClick={() => setFilter('music')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${filter === 'music' ? 'bg-pink-400/20 text-pink-400 border border-pink-400/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}><Music size={14}/> Müzikler</button>
      </div>

      {filteredCatalogs.length === 0 && (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-bold text-lg">Bu kategoride henüz bir öğe yok.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCatalogs.map((item) => {
          const details = getCategoryDetails(item.category);
          return (
            <div key={item.id} onClick={() => openEdit(item.id)} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group relative flex flex-col shadow-lg cursor-pointer hover:border-gray-500 transition-all hover:-translate-y-1">
              <div className="h-40 bg-gray-900 relative">
                {item.photos && item.photos.length > 0 ? (
                  <img src={item.photos[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center opacity-30 ${details.color}`}>{details.icon}</div>
                )}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-md ${details.bg} ${details.color} border border-current`}>
                  {details.label}
                </div>
              </div>
              <div className="p-4 border-t border-gray-700">
                <h3 className="font-bold text-lg text-white truncate">{item.name || 'İSİMSİZ ÖĞE'}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}