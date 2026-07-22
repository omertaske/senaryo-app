import ScriptBlock from './ScriptBlock';
import { Check, X, User, MapPin, Edit2, ListTree, Archive, Music } from 'lucide-react';

export default function ScriptEditorView({ 
  blocks, updateBlock, handleKeyDown, inputRefs, characters, locations, catalogs,
  pendingItem, confirmAddItem, cancelAddItem, episodes, activeEpId, 
  setActiveEpId, addNewEpisode, deleteEpisode, setActiveTab, 
  quickPreview, closeQuickPreview, goToEdit, openQuickPreview,
  showRoadmap, setShowRoadmap, sequences,
  rightDrawerItem, setRightDrawerItem, openRightDrawer // YENİ PROPLAR
}) {
  return (
    <div className="flex w-full h-full relative overflow-hidden bg-gray-950">
      
      {/* SOL YAN PANEL: HİKAYE HARİTASI (BEATS / SEKANS LİSTESİ) */}
      <div 
        className={`flex-shrink-0 bg-gray-900 border-r border-gray-700 transition-all duration-300 overflow-y-auto h-full flex flex-col z-20 ${
          showRoadmap ? 'w-80 p-4' : 'w-0 p-0 border-none opacity-0'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700 overflow-hidden w-full">
          <h3 className="text-amber-500 font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap text-sm">
            <ListTree size={18} /> Hikaye Haritası
          </h3>
          <button onClick={() => setShowRoadmap(false)} className="text-gray-400 hover:text-white flex-shrink-0 p-1"><X size={18} /></button>
        </div>
        
        <div className="space-y-6 overflow-hidden w-full">
          {sequences.length === 0 && (
            <p className="text-xs text-gray-500 whitespace-nowrap italic">Mantar panoya henüz beat eklenmedi.</p>
          )}
          {sequences.map(seq => (
            <div key={seq.id}>
              <h4 className="text-gray-300 font-bold text-xs uppercase mb-3 px-1 truncate">{seq.title}</h4>
              <div className="space-y-2 border-l-2 border-gray-700 ml-2 pl-3">
                {seq.beats.length === 0 && <p className="text-[11px] text-gray-600 italic">Boş sekans</p>}
                {seq.beats.map(beat => (
                  <div key={beat.id} className="group relative">
                    <div className={`absolute -left-[15px] top-2 w-2 h-2 rounded-full ${beat.color || 'bg-gray-600'} ring-4 ring-gray-900`}></div>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 group-hover:border-amber-500 transition-colors shadow-sm">
                      <h5 className="text-white text-xs font-bold">{beat.title}</h5>
                      {beat.description && <p className="text-gray-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">{beat.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORTA: SENARYO YAZIM ALANI */}
      <div className="flex-1 overflow-y-auto w-full pb-32">
        <div className="max-w-4xl mx-auto px-4 relative">
          
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-800 rounded-lg text-sm text-gray-400 mt-8 shadow-md">
            <div className="flex items-center gap-4">
              {!showRoadmap && (
                <button onClick={() => setShowRoadmap(true)} className="flex items-center gap-2 bg-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-amber-500/30 font-semibold text-xs shadow">
                  <ListTree size={16} /> Haritayı Aç
                </button>
              )}
              <span><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Tab</kbd> Tür</span>
              <span><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Enter</kbd> Yeni Satır</span>
              <span className="text-blue-400"><kbd className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Ctrl</kbd> + Tık: Çekmeceyi Aç</span>
            </div>
            <div className="font-mono text-xs">Kelime: {blocks.reduce((acc, b) => acc + b.text.split(' ').filter(String).length, 0)}</div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-700">
            {episodes.map(ep => (
              <div
                key={ep.id}
                onClick={() => setActiveEpId(ep.id)}
                className={`flex items-center gap-3 px-5 py-3 font-bold rounded-t-xl transition-all cursor-pointer group ${
                  activeEpId === ep.id 
                    ? 'bg-white dark:bg-gray-100 text-black shadow-md translate-y-1' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{ep.title}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteEpisode(ep.id); }} 
                  className={`p-1 rounded-full transition-colors ${activeEpId === ep.id ? 'hover:bg-red-500 hover:text-white text-gray-400' : 'hover:bg-red-500 hover:text-white text-gray-600'}`}
                  title="Bölümü Sil"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button 
              onClick={addNewEpisode} 
              className="px-5 py-3 font-bold rounded-t-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-dashed border-blue-500/50 flex-shrink-0 text-sm"
            >
              + Yeni Bölüm
            </button>
          </div>

          <div className="bg-white dark:bg-gray-100 text-black shadow-2xl min-h-[1056px] w-full p-16 font-mono text-lg rounded-b-xl rounded-tr-xl">
            {blocks.map((block, index) => (
              <ScriptBlock
                key={block.id}
                index={index}
                block={block}
                updateBlock={updateBlock}
                handleKeyDown={handleKeyDown}
                ref={(el) => (inputRefs.current[block.id] = el)} 
                characters={characters}
                locations={locations}
                catalogs={catalogs}
                openRightDrawer={openRightDrawer} // BÜYÜK MODAL YERİNE ÇEKMECE
              />
            ))}
          </div>
        </div>
      </div>

      {/* YENİ: SAĞ YAN ÇEKMECE (HIZLI BAKIŞ) */}
      <div className={`flex-shrink-0 bg-gray-900 border-l border-gray-700 transition-all duration-300 overflow-y-auto h-full flex flex-col z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${rightDrawerItem ? 'w-80' : 'w-0 border-none opacity-0'}`}>
        {rightDrawerItem && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-800/30 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">Çekmece Önizleme</h3>
              <button onClick={() => setRightDrawerItem(null)} className="text-gray-500 hover:text-white p-1 bg-gray-800 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              
              {/* Görsel Alanı (Tıklayınca Tam Ekran Modalı Açar) */}
              <div 
                className="w-full h-44 bg-black rounded-xl border border-gray-700 relative group cursor-pointer overflow-hidden shadow-lg"
                onClick={() => openQuickPreview(rightDrawerItem.type, rightDrawerItem.data)}
                title="Büyük Ekran Önizleme İçin Tıkla"
              >
                 {rightDrawerItem.data.photos?.[0] ? (
                   <img src={rightDrawerItem.data.photos[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-800"><Archive size={40}/></div>
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white font-bold text-sm bg-blue-600 px-4 py-2 rounded-full shadow-xl">Genişlet</span>
                 </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white uppercase break-words leading-tight">{rightDrawerItem.data.name}</h2>
                <p className="text-xs text-blue-400 uppercase tracking-widest mt-2 font-bold bg-blue-900/30 inline-block px-2 py-1 rounded">
                  {rightDrawerItem.type === 'character' ? 'Karakter' : rightDrawerItem.type === 'location' ? 'Mekan' : 'Katalog Objesi'}
                </p>
              </div>

              {/* SES ÇALAR (Kullanıcı kendi başlatır) */}
              {rightDrawerItem.data.mediaLink && !rightDrawerItem.data.mediaLink.includes('youtu') && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-inner flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-pink-400">
                    <Music size={16} /> <span className="text-xs font-bold uppercase">Ses Oynatıcı</span>
                  </div>
                  <audio controls className="w-full h-10 outline-none rounded" src={rightDrawerItem.data.mediaLink} />
                </div>
              )}
              
              {/* Youtube Linki Varsa */}
              {rightDrawerItem.data.mediaLink && rightDrawerItem.data.mediaLink.includes('youtu') && (
                <button onClick={() => openQuickPreview(rightDrawerItem.type, rightDrawerItem.data)} className="bg-red-600/20 text-red-400 border border-red-500/30 p-3 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-lg">
                  Youtube Videosunu İzle
                </button>
              )}

              <div>
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">Kısa Bilgi</h4>
                <p className="text-sm text-gray-300 line-clamp-6 leading-relaxed italic">
                   {rightDrawerItem.data.description || 'Açıklama girilmemiş.'}
                </p>
              </div>

            </div>
          </>
        )}
      </div>

      {/* ESKİ SİNEMATİK HIZLI ÖNİZLEME (QUICK PREVIEW) MODALI */}
      {quickPreview && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={closeQuickPreview}
        >
          <div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.6)] relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <button onClick={closeQuickPreview} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all z-10 backdrop-blur-md">
              <X size={20} />
            </button>

            {/* KARAKTER ÖNİZLEMESİ */}
            {quickPreview.type === 'character' && (
              <>
                <div className="relative h-48 w-full">
                   {quickPreview.data.photos?.[0] ? (
                     <>
                       <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                     </>
                   ) : (
                     <div className="w-full h-full bg-gray-800 flex items-center justify-center"><User size={64} className="text-gray-700" /></div>
                   )}
                   <div className="absolute bottom-[-40px] left-8 w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 shadow-xl">
                     {quickPreview.data.photos?.[0] ? <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover" /> : <User size={40} className="m-auto h-full text-gray-500" />}
                   </div>
                </div>

                <div className="px-8 pt-14 pb-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider drop-shadow-md">{quickPreview.data.name}</h2>
                  <p className="text-blue-400 font-medium mt-1">{quickPreview.data.profession}</p>

                  <div className="mt-6 space-y-4 text-sm text-gray-300 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    {quickPreview.data.goal && <p><span className="text-gray-500 font-bold uppercase text-xs block mb-1">Amacı</span>{quickPreview.data.goal}</p>}
                    {quickPreview.data.spouse && <p><span className="text-gray-500 font-bold uppercase text-xs block mb-1">Eşi / Sevgilisi</span>{quickPreview.data.spouse}</p>}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button onClick={() => goToEdit('character', quickPreview.data.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-900/20">
                      <Edit2 size={16} /> Detayları Düzenle
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* MEKAN ÖNİZLEMESİ */}
            {quickPreview.type === 'location' && (
               <>
                <div className="relative h-60 w-full">
                   {quickPreview.data.photos?.[0] ? (
                     <>
                       <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                     </>
                   ) : (
                     <div className="w-full h-full bg-gray-800 flex items-center justify-center"><MapPin size={64} className="text-gray-700" /></div>
                   )}
                   <div className="absolute bottom-6 left-8 right-8">
                     <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block backdrop-blur-md">{quickPreview.data.setting}</span>
                     <h2 className="text-3xl font-bold text-white uppercase tracking-wider drop-shadow-lg">{quickPreview.data.name}</h2>
                   </div>
                </div>

                <div className="px-8 py-8">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    {quickPreview.data.timeOfDay && <div><span className="text-gray-500 font-bold uppercase text-xs block mb-1">Zaman</span>{quickPreview.data.timeOfDay}</div>}
                    {quickPreview.data.atmosphere && <div><span className="text-gray-500 font-bold uppercase text-xs block mb-1">Atmosfer</span>{quickPreview.data.atmosphere}</div>}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button onClick={() => goToEdit('location', quickPreview.data.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-emerald-900/20">
                      <Edit2 size={16} /> Mekanı Düzenle
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* KATALOG / MULTİMEDYA ÖNİZLEMESİ */}
            {quickPreview.type === 'catalog' && (
              <div className="flex flex-col h-full bg-gray-900">
                <div className="relative w-full bg-black flex items-center justify-center border-b border-gray-800" style={{ minHeight: '300px' }}>
                  
                  {/* YouTube Varsa Oynat */}
                  {quickPreview.data.mediaLink?.includes('youtube.com') || quickPreview.data.mediaLink?.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full absolute inset-0"
                      src={`https://www.youtube.com/embed/${quickPreview.data.mediaLink.split(/v=|youtu\.be\//)[1]?.split('&')[0]}?autoplay=1`} 
                      title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                    </iframe>
                  ) : 
                  /* Video Yoksa Fotoğrafı Büyük Göster */
                  quickPreview.data.photos?.[0] ? (
                    <img src={quickPreview.data.photos[0]} className="w-full h-full max-h-[400px] object-contain p-4" alt="Katalog Görseli" />
                  ) : (
                    <div className="text-gray-600 flex flex-col items-center"><Archive size={48} /><span className="mt-2 text-xs uppercase tracking-widest font-bold">GÖRSEL BULUNAMADI</span></div>
                  )}

                  <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md border border-gray-500/30">
                    {quickPreview.data.category === 'prop' ? 'Eşya / Obje' : quickPreview.data.category === 'vehicle' ? 'Araç' : quickPreview.data.category === 'music' ? 'Müzik' : 'Evren Kuralı'}
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">{quickPreview.data.name}</h2>
                  
                  <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {quickPreview.data.description || 'Bu öğe için detaylı bir açıklama girilmemiş.'}
                    </p>
                  </div>
                </div>
                
              </div>
            )}

          </div>
        </div>
      )}

      {/* BİLDİRİM: Yeni Karakter veya Mekan Algılandığında Çıkar */}
      {pendingItem && (
        <div className="fixed bottom-10 right-10 bg-gray-800 border border-blue-500 p-5 rounded-2xl shadow-2xl z-50 flex flex-col gap-4 max-w-sm transition-all">
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-blue-400 text-lg block mb-1">{pendingItem.name}</strong> 
            Bu isimde bir {pendingItem.type === 'character' ? 'Karakter' : 'Mekan'} projenin veritabanında yok. <br/>
            {pendingItem.type === 'character' ? 'Karakterler' : 'Mekanlar'} sekmesine otomatik açayım mı?
          </p>
          <div className="flex gap-3 mt-1">
            <button onClick={confirmAddItem} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold">
              <Check size={18} /> Evet, Aç
            </button>
            <button onClick={cancelAddItem} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold">
              <X size={18} /> Hayır
            </button>
          </div>
        </div>
      )}
    </div>
  );
}