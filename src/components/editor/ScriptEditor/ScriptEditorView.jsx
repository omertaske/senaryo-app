import ScriptBlock from './ScriptBlock';
import { Check, X, User, MapPin, Edit2 } from 'lucide-react';

export default function ScriptEditorView({ 
  blocks, 
  updateBlock, 
  handleKeyDown, 
  inputRefs,
  characters,
  locations, 
  pendingItem, 
  confirmAddItem, 
  cancelAddItem,
  episodes, 
  activeEpId, 
  setActiveEpId, 
  addNewEpisode,
  deleteEpisode, 
  setActiveTab, 
  quickPreview, 
  closeQuickPreview, 
  goToEdit, 
  openQuickPreview
}) {
  return (
    <div className="max-w-4xl mx-auto pb-32 relative">
      
      {/* Üst Bilgi Çubuğu */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-800 rounded-lg text-sm text-gray-400 mt-8">
        <div className="flex gap-4">
          <span><kbd className="bg-gray-700 px-2 py-1 rounded">Tab</kbd> Tür Değiştir</span>
          <span><kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd> Yeni Satır</span>
          <span className="text-blue-400"><kbd className="bg-gray-700 text-gray-300 px-2 py-1 rounded">Ctrl</kbd> + Tıkla: Önizleme Aç</span>
        </div>
        <div>Kelime: {blocks.reduce((acc, b) => acc + b.text.split(' ').filter(String).length, 0)}</div>
      </div>

      {/* DİZİ / BÖLÜM SEKMELERİ */}
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
          className="px-5 py-3 font-bold rounded-t-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-dashed border-blue-500/50 flex-shrink-0"
        >
          + Yeni Bölüm
        </button>
      </div>

      {/* A4 KAĞIDI GÖRÜNÜMÜ */}
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
            setActiveTab={setActiveTab}
            openQuickPreview={openQuickPreview} // EKSİK OLAN BUYDU, EKLENDİ!
          />
        ))}
      </div>

      {quickPreview && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={closeQuickPreview} // Boşluğa tıklayınca kapatır
        >
          {/* Modalın kendisi (Tıklamaların dışarı taşmasını engeller) */}
          <div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.6)] relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            {/* Kapat Butonu */}
            <button onClick={closeQuickPreview} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-all z-10 backdrop-blur-md">
              <X size={20} />
            </button>

            {/* KARAKTER ÖNİZLEMESİ */}
            {quickPreview.type === 'character' && (
              <>
                {/* Üst Kısım: Kapak Fotoğrafı */}
                <div className="relative h-48 w-full">
                   {quickPreview.data.photos?.[0] ? (
                     <>
                       <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                     </>
                   ) : (
                     <div className="w-full h-full bg-gray-800 flex items-center justify-center"><User size={64} className="text-gray-700" /></div>
                   )}
                   {/* Profil Fotoğrafı (Yuvarlak) */}
                   <div className="absolute bottom-[-40px] left-8 w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 shadow-xl">
                     {quickPreview.data.photos?.[0] ? <img src={quickPreview.data.photos[0]} className="w-full h-full object-cover" /> : <User size={40} className="m-auto h-full text-gray-500" />}
                   </div>
                </div>

                {/* Alt Kısım: Bilgiler */}
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