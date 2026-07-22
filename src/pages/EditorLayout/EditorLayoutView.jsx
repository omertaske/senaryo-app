import { Home, Download, FileText, FileCode, Archive, X } from 'lucide-react';
import ScriptEditor from '../../components/editor/ScriptEditor';
import Characters from '../../components/editor/Characters';
import Locations from '../../components/editor/Locations';
import Beats from '../../components/editor/Beats';
import Catalogs from '../../components/editor/Catalogs';
import Synopsis from '../../components/editor/Synopsis';
import Treatment from '../../components/editor/Treatment';
import StorageIndicator from '../../components/StorageIndicator';

// MOTORLARI IMPORT ETTİK
import { exportToFountain, exportToSenaryo, exportToPDF } from '../../lib/exportUtils';

export default function EditorLayoutView({ project, activeTab, setActiveTab, handleGoHome, isExportModalOpen, setIsExportModalOpen }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-10">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="font-bold text-lg truncate" title={project.title}>{project.title}</span>
          <button onClick={handleGoHome} className="text-gray-400 hover:text-white transition-colors bg-gray-900 p-2 rounded-full"><Home size={16} /></button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          <TabButton name="Senaryo" id="script" current={activeTab} set={setActiveTab} />
          <TabButton name="Sinopsis" id="synopsis" current={activeTab} set={setActiveTab} />
          <TabButton name="Tretman" id="treatment" current={activeTab} set={setActiveTab} />
          <TabButton name="Karakterler" id="characters" current={activeTab} set={setActiveTab} />
          <TabButton name="Mekanlar" id="locations" current={activeTab} set={setActiveTab} />
          <TabButton name="Kataloglar" id="catalogs" current={activeTab} set={setActiveTab} />
          <TabButton name="Sekans / Beat" id="beats" current={activeTab} set={setActiveTab} />
        </nav>
        
        <div className="px-4"><StorageIndicator /></div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors shadow-lg"
          >
            <Download size={20} /> Çıktı Al / İndir
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
        {activeTab === 'script' && <ScriptEditor setActiveTab={setActiveTab}/> }
        {activeTab === 'synopsis' && <Synopsis />}
        {activeTab === 'treatment' && <Treatment />}
        {activeTab === 'characters' &&  <Characters />}
        {activeTab === 'locations' && <Locations />}
        {activeTab === 'beats' && <Beats />}
        {activeTab === 'catalogs' && <Catalogs />}
      </main>

      {/* YENİ: DIŞA AKTARIM (EXPORT) MODALI */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsExportModalOpen(false)}>
          <div className="bg-gray-800 border border-gray-600 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsExportModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-900 p-2 rounded-full"><X size={20} /></button>
            
            <h2 className="text-2xl font-bold text-white mb-2">Projeyi İndir</h2>
            <p className="text-gray-400 text-sm mb-8">İhtiyacınıza uygun formatı seçin.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <button onClick={() => { exportToPDF(project); setIsExportModalOpen(false); }} className="bg-gray-900 border border-gray-700 hover:border-red-500 rounded-xl p-6 flex flex-col items-center justify-center gap-4 group transition-all">
                <div className="bg-red-500/20 p-4 rounded-full text-red-500 group-hover:scale-110 transition-transform"><FileText size={32}/></div>
                <div className="text-center">
                  <h3 className="font-bold text-white mb-1">Gelişmiş PDF</h3>
                  <p className="text-[10px] text-gray-500">Tüm proje (Sinopsis, Karakterler, Senaryo) tek dosya halinde kitap gibi yazdırılır.</p>
                </div>
              </button>

              <button onClick={() => { exportToSenaryo(project); setIsExportModalOpen(false); }} className="bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-4 group transition-all">
                <div className="bg-blue-500/20 p-4 rounded-full text-blue-500 group-hover:scale-110 transition-transform"><Archive size={32}/></div>
                <div className="text-center">
                  <h3 className="font-bold text-white mb-1">Proje Yedek (.senaryo)</h3>
                  <p className="text-[10px] text-gray-500">Başka bir kullanıcıya göndermek veya yedeklemek için tüm medya ve yazıları sıkıştırır.</p>
                </div>
              </button>

              <button onClick={() => { exportToFountain(project); setIsExportModalOpen(false); }} className="bg-gray-900 border border-gray-700 hover:border-amber-500 rounded-xl p-6 flex flex-col items-center justify-center gap-4 group transition-all">
                <div className="bg-amber-500/20 p-4 rounded-full text-amber-500 group-hover:scale-110 transition-transform"><FileCode size={32}/></div>
                <div className="text-center">
                  <h3 className="font-bold text-white mb-1">Fountain (.fountain)</h3>
                  <p className="text-[10px] text-gray-500">Sadece senaryo metnini Final Draft, Celtx gibi programlarda açılacak şekilde verir.</p>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function TabButton({ name, id, current, set }) {
  const isActive = current === id;
  return (
    <button onClick={() => set(id)} className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all font-semibold ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-gray-700 text-gray-400 border border-transparent'}`}>
      {name}
    </button>
  );
}