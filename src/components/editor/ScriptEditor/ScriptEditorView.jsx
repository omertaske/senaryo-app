import ScriptBlock from './ScriptBlock';
import { Check, X, User, MapPin, Edit2, ListTree, Archive, Music } from 'lucide-react';

export default function ScriptEditorView({ 
  blocks, updateBlock, handleKeyDown, inputRefs, characters, locations, catalogs,
  pendingItem, confirmAddItem, cancelAddItem, episodes, activeEpId, 
  setActiveEpId, addNewEpisode, deleteEpisode, setActiveTab, 
  quickPreview, closeQuickPreview, goToEdit, openQuickPreview,
  showRoadmap, setShowRoadmap, sequences,
  rightDrawerItem, setRightDrawerItem, openRightDrawer
}) {
  return (
    <div className="flex w-full h-full relative overflow-hidden bg-background">
      
      {/* SOL YAN PANEL: HİKAYE HARİTASI (BEATS / SEKANS LİSTESİ) */}
      <div 
        className={`flex-shrink-0 bg-panel border-r border-border transition-all duration-300 overflow-y-auto h-full flex flex-col z-20 ${
          showRoadmap ? 'w-80 p-5' : 'w-0 p-0 border-none opacity-0'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border overflow-hidden w-full">
          <h3 className="text-accent font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap text-sm">
            <ListTree size={18} /> Hikaye Haritası
          </h3>
          <button onClick={() => setShowRoadmap(false)} className="text-muted hover:text-main flex-shrink-0 p-1.5 rounded-lg hover:bg-hover transition-colors"><X size={18} /></button>
        </div>
        
        <div className="space-y-6 overflow-hidden w-full">
          {sequences.length === 0 && (
            <p className="text-xs text-muted whitespace-nowrap italic">Mantar panoya henüz beat eklenmedi.</p>
          )}
          {sequences.map(seq => (
            <div key={seq.id}>
              <h4 className="text-main font-bold text-xs uppercase mb-3 px-1 truncate">{seq.title}</h4>
              <div className="space-y-3 border-l-2 border-border ml-2 pl-3">
                {seq.beats.length === 0 && <p className="text-[11px] text-muted italic">Boş sekans</p>}
                {seq.beats.map(beat => (
                  <div key={beat.id} className="group relative">
                    <div className={`absolute -left-[17px] top-2 w-2.5 h-2.5 rounded-full ${beat.color || 'bg-accent'} ring-4 ring-panel`}></div>
                    <div className="bg-background p-3.5 rounded-xl border border-border group-hover:border-accent transition-colors shadow-sm">
                      <h5 className="text-main text-xs font-bold">{beat.title}</h5>
                      {beat.description && <p className="text-muted text-[11px] mt-1.5 line-clamp-2 leading-relaxed">{beat.description}</p>}
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
          
          <div className="flex items-center justify-between mb-6 p-4 bg-panel border border-border rounded-xl text-sm text-muted mt-8 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-4">
              {!showRoadmap && (
                <button onClick={() => setShowRoadmap(true)} className="flex items-center gap-2 bg-accent/20 text-accent hover:bg-accent hover:text-white px-3.5 py-2 rounded-lg transition-all border border-accent/30 font-bold text-xs shadow">
                  <ListTree size={16} /> Haritayı Aç
                </button>
              )}
              <span><kbd className="bg-background border border-border px-2 py-1 rounded text-xs font-mono">Tab</kbd> Tür</span>
              <span><kbd className="bg-background border border-border px-2 py-1 rounded text-xs font-mono">Enter</kbd> Yeni Satır</span>
              <span className="text-accent font-semibold"><kbd className="bg-background border border-border text-main px-2 py-1 rounded text-xs font-mono">Ctrl</kbd> + Tık: Çekmece</span>
            </div>
            <div className="font-mono text-xs font-bold text-main">Kelime: {blocks.reduce((acc, b) => acc + b.text.split(' ').filter(String).length, 0)}</div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
            {episodes.map(ep => (
              <div
                key={ep.id}
                onClick={() => setActiveEpId(ep.id)}
                className={`flex items-center gap-3 px-6 py-3 font-bold rounded-t-2xl transition-all cursor-pointer group border-x border-t ${
                  activeEpId === ep.id 
                    ? 'bg-panel border-border text-main shadow-lg translate-y-1' 
                    : 'bg-background border-transparent text-muted hover:bg-hover hover:text-main'
                }`}
              >
                <span>{ep.title}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteEpisode(ep.id); }} 
                  className={`p-1 rounded-full transition-colors ${activeEpId === ep.id ? 'hover:bg-red-500 hover:text-white text-muted' : 'hover:bg-red-500 hover:text-white text-muted'}`}
                  title="Bölümü Sil"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button 
              onClick={addNewEpisode} 
              className="px-6 py-3 font-bold rounded-t-2xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all border border-dashed border-accent/50 flex-shrink-0 text-sm"
            >
              + Yeni Bölüm
            </button>
          </div>

          <div className="bg-panel text-main shadow-2xl min-h-[1056px] w-full p-16 md:p-24 font-mono text-lg rounded-b-2xl rounded-tr-2xl border border-border relative">
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
                openRightDrawer={openRightDrawer}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SAĞ YAN ÇEKMECE (HIZLI BAKIŞ) */}
      <div className={`flex-shrink-0 bg-panel border-l border-border transition-all duration-300 overflow-y-auto h-full flex flex-col z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${rightDrawerItem ? 'w-80' : 'w-0 border-none opacity-0'}`}>
        {rightDrawerItem && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-border bg-panel/80 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="text-muted font-bold text-xs uppercase tracking-wider flex items-center gap-2">Çekmece Önizleme</h3>
              <button onClick={() => setRightDrawerItem(null)} className="text-muted hover:text-main p-1.5 bg-background rounded-full border border-border"><X size={16} /></button>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              
              <div 
                className="w-full h-44 bg-background rounded-2xl border border-border relative group cursor-pointer overflow-hidden shadow-lg"
                onClick={() => openQuickPreview(rightDrawerItem.type, rightDrawerItem.data)}
                title="Büyük Ekran Önizleme İçin Tıkla"
              >
                 {rightDrawerItem.data.photos?.[0] ? (
                   <img src={rightDrawerItem.data.photos[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted bg-background"><Archive size={40}/></div>
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white font-bold text-sm bg-accent px-4 py-2 rounded-full shadow-xl">Genişlet</span>
                 </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-main uppercase break-words leading-tight">{rightDrawerItem.data.name}</h2>
                <p className="text-xs text-accent uppercase tracking-widest mt-2 font-bold bg-accent/10 border border-accent/20 inline-block px-2.5 py-1 rounded-md">
                  {rightDrawerItem.type === 'character' ? 'Karakter' : rightDrawerItem.type === 'location' ? 'Mekan' : 'Katalog Objesi'}
                </p>
              </div>

              {rightDrawerItem.data.mediaLink && !rightDrawerItem.data.mediaLink.includes('youtu') && (
                <div className="bg-background rounded-2xl p-4 border border-border shadow-inner flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-accent">
                    <Music size={16} /> <span className="text-xs font-bold uppercase">Ses Oynatıcı</span>
                  </div>
                  <audio controls className="w-full h-10 outline-none rounded" src={rightDrawerItem.data.mediaLink} />
                </div>
              )}
              
              {rightDrawerItem.data.mediaLink && rightDrawerItem.data.mediaLink.includes('youtu') && (
                <button onClick={() => openQuickPreview(rightDrawerItem.type, rightDrawerItem.data)} className="bg-red-500/10 text-red-500 border border-red-500/30 p-3.5 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg">
                  Youtube Videosunu İzle
                </button>
              )}

              <div>
                <h4 className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2 border-b border-border pb-1">Kısa Bilgi</h4>
                <p className="text-sm text-muted line-clamp-6 leading-relaxed italic">
                   {rightDrawerItem.data.description || 'Açıklama girilmemiş.'}
                </p>
              </div>

            </div>
          </>
        )}
      </div>

      {/* SİNEMATİK HIZLI ÖNİZLEME (QUICK PREVIEW) MODALI */}
      {quickPreview && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200" 
          onClick={closeQuickPreview}
        >
          <div 
            className="bg-panel border border-border rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <button onClick={closeQuickPreview} className="absolute top-4 right-4 text-muted hover:text-main bg-background border border-border p-2 rounded-full transition-all z-10">
              <X size={20} />
            </button>

            {/* KARAKTER ÖNİZLEMESİ */}
            {quickPreview.type === 'character' && (
              <>
                <div className="relative h-48 w-full bg-background">
                   {quickPreview.data.photos?.[0] ? (
                     <>
                       <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 bg-gradient-to-t from-panel to-transparent" />
                     </>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center"><User size={64} className="text-muted" /></div>
                   )}
                   <div className="absolute bottom-[-40px] left-8 w-24 h-24 rounded-full border-4 border-panel overflow-hidden bg-background shadow-xl">
                     {quickPreview.data.photos?.[0] ? <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover" /> : <User size={40} className="m-auto h-full text-muted" />}
                   </div>
                </div>

                <div className="px-8 pt-14 pb-8">
                  <h2 className="text-2xl font-bold text-main uppercase tracking-wider">{quickPreview.data.name}</h2>
                  <p className="text-accent font-medium mt-1">{quickPreview.data.profession}</p>

                  <div className="mt-6 space-y-4 text-sm text-muted bg-background p-4 rounded-2xl border border-border">
                    {quickPreview.data.goal && <p><span className="text-main font-bold uppercase text-xs block mb-1">Amacı</span>{quickPreview.data.goal}</p>}
                    {quickPreview.data.spouse && <p><span className="text-main font-bold uppercase text-xs block mb-1">Eşi / Sevgilisi</span>{quickPreview.data.spouse}</p>}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button onClick={() => goToEdit('character', quickPreview.data.id)} className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg">
                      <Edit2 size={16} /> Detayları Düzenle
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* MEKAN ÖNİZLEMESİ */}
            {quickPreview.type === 'location' && (
               <>
                <div className="relative h-60 w-full bg-background">
                   {quickPreview.data.photos?.[0] ? (
                     <>
                       <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/60 to-transparent" />
                     </>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center"><MapPin size={64} className="text-muted" /></div>
                   )}
                   <div className="absolute bottom-6 left-8 right-8">
                     <span className="bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block backdrop-blur-md">{quickPreview.data.setting}</span>
                     <h2 className="text-3xl font-bold text-main uppercase tracking-wider">{quickPreview.data.name}</h2>
                   </div>
                </div>

                <div className="px-8 py-8">
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted bg-background p-4 rounded-2xl border border-border">
                    {quickPreview.data.timeOfDay && <div><span className="text-main font-bold uppercase text-xs block mb-1">Zaman</span>{quickPreview.data.timeOfDay}</div>}
                    {quickPreview.data.atmosphere && <div><span className="text-main font-bold uppercase text-xs block mb-1">Atmosfer</span>{quickPreview.data.atmosphere}</div>}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button onClick={() => goToEdit('location', quickPreview.data.id)} className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg">
                      <Edit2 size={16} /> Mekanı Düzenle
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* KATALOG / MULTİMEDYA ÖNİZLEMESİ */}
            {quickPreview.type === 'catalog' && (
              <div className="flex flex-col h-full bg-panel">
                <div className="relative w-full bg-black flex items-center justify-center border-b border-border" style={{ minHeight: '300px' }}>
                  
                  {quickPreview.data.mediaLink?.includes('youtube.com') || quickPreview.data.mediaLink?.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full absolute inset-0"
                      src={`https://www.youtube.com/embed/${quickPreview.data.mediaLink.split(/v=|youtu\.be\//)[1]?.split('&')[0]}?autoplay=1`} 
                      title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                    </iframe>
                  ) : 
                  quickPreview.data.photos?.[0] ? (
                    <img src={quickPreview.data.photos[0]} className="w-full h-full max-h-[400px] object-contain p-4" alt="Katalog Görseli" />
                  ) : (
                    <div className="text-muted flex flex-col items-center"><Archive size={48} /><span className="mt-2 text-xs uppercase tracking-widest font-bold">GÖRSEL BULUNAMADI</span></div>
                  )}

                  <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md border border-border">
                    {quickPreview.data.category === 'prop' ? 'Eşya / Obje' : quickPreview.data.category === 'vehicle' ? 'Araç' : quickPreview.data.category === 'music' ? 'Müzik' : 'Evren Kuralı'}
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                  <h2 className="text-3xl font-bold text-main uppercase tracking-wider mb-2">{quickPreview.data.name}</h2>
                  
                  <div className="bg-background p-5 rounded-2xl border border-border">
                    <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">
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
        <div className="fixed bottom-10 right-10 bg-panel border-2 border-accent p-6 rounded-2xl shadow-2xl z-50 flex flex-col gap-4 max-w-sm transition-all animate-in slide-in-from-bottom-5">
          <p className="text-main text-sm leading-relaxed">
            <strong className="text-accent text-lg block mb-1">{pendingItem.name}</strong> 
            Bu isimde bir {pendingItem.type === 'character' ? 'Karakter' : 'Mekan'} projenin veritabanında yok. <br/>
            Sekmesine otomatik açayım mı?
          </p>
          <div className="flex gap-3 mt-1">
            <button onClick={confirmAddItem} className="flex-1 bg-accent hover:bg-accent-hover text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
              <Check size={18} /> Evet, Aç
            </button>
            <button onClick={cancelAddItem} className="flex-1 bg-hover hover:bg-border text-main py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold">
              <X size={18} /> Hayır
            </button>
          </div>
        </div>
      )}
    </div>
  );
}