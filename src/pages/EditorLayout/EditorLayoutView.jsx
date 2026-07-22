import { Home, Download, FileText, FileCode, Archive, X, Clapperboard, Edit2 } from 'lucide-react';
import ScriptEditor from '../../components/editor/ScriptEditor';
import Characters from '../../components/editor/Characters';
import Locations from '../../components/editor/Locations';
import Beats from '../../components/editor/Beats';
import Catalogs from '../../components/editor/Catalogs';
import Synopsis from '../../components/editor/Synopsis';
import Treatment from '../../components/editor/Treatment';
import StorageIndicator from '../../components/StorageIndicator';
import { exportToFountain, exportToSenaryo, exportToPDF } from '../../lib/exportUtils';

export default function EditorLayoutView({ 
  project, activeTab, setActiveTab, handleGoHome, isExportModalOpen, setIsExportModalOpen, handleRenameProject 
}) {
  
  // İsim değiştirmek için basit kutucuk tetikleyicisi
  const onRenameClick = () => {
    const newName = window.prompt("Projenin yeni adını girin:", project.title);
    if(newName !== null && newName.trim() !== "") {
        handleRenameProject(newName.trim());
    }
  };

  return (
    <div className="flex h-screen bg-background text-main font-sans overflow-hidden transition-colors duration-500">
      
      {/* Şık Yan Menü */}
      <aside className="w-72 bg-panel border-r border-border flex flex-col z-10 shadow-2xl">
        
        {/* YENİLENEN ÜST KISIM */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          
          {/* Proje Adı - Tıklanabilir */}
          <div 
            className="flex items-center gap-3 overflow-hidden group cursor-pointer flex-1" 
            onClick={onRenameClick}
            title="Proje adını değiştirmek için tıkla"
          >
            <div className="bg-accent/20 p-2 rounded-xl border border-accent/30 flex-shrink-0">
              <Clapperboard size={20} className="text-accent" />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="font-bold text-lg truncate group-hover:text-accent transition-colors leading-tight">{project.title}</span>
               <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity font-semibold flex items-center gap-1 mt-0.5">
                 <Edit2 size={10}/> Yeniden Adlandır
               </span>
            </div>
          </div>
          
          {/* Ayrı bir Ana Sayfa Butonu */}
          <button 
            onClick={handleGoHome} 
            className="text-muted hover:text-main transition-colors bg-background p-2.5 rounded-full shadow-inner flex-shrink-0 ml-2 hover:scale-110" 
            title="Ana Sayfaya Dön"
          >
            <Home size={18} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <TabButton name="Senaryo" id="script" current={activeTab} set={setActiveTab} />
          <TabButton name="Sinopsis" id="synopsis" current={activeTab} set={setActiveTab} />
          <TabButton name="Tretman" id="treatment" current={activeTab} set={setActiveTab} />
          <TabButton name="Karakterler" id="characters" current={activeTab} set={setActiveTab} />
          <TabButton name="Mekanlar" id="locations" current={activeTab} set={setActiveTab} />
          <TabButton name="Kataloglar" id="catalogs" current={activeTab} set={setActiveTab} />
          <TabButton name="Sekans / Beat" id="beats" current={activeTab} set={setActiveTab} />
        </nav>
        
        <div className="px-4 py-2"><StorageIndicator /></div>
        

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="w-full bg-accent hover:bg-accent-hover text-white px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg hover:-translate-y-1"
          >
            <Download size={20} /> Çıktı Al / İndir
          </button>
        </div>
      </aside>

      {/* Dinamik Ana İçerik */}
      <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12 relative">
        {activeTab === 'script' && <ScriptEditor setActiveTab={setActiveTab}/> }
        {activeTab === 'synopsis' && <Synopsis />}
        {activeTab === 'treatment' && <Treatment />}
        {activeTab === 'characters' &&  <Characters />}
        {activeTab === 'locations' && <Locations />}
        {activeTab === 'beats' && <Beats />}
        {activeTab === 'catalogs' && <Catalogs />}
      </main>

      {/* Şık İndirme Modalı (Aynı kaldı) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in" onClick={() => setIsExportModalOpen(false)}>
          <div className="bg-panel border border-border rounded-3xl w-full max-w-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] relative flex flex-col p-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsExportModalOpen(false)} className="absolute top-6 right-6 text-muted hover:text-main bg-background border border-border p-2 rounded-full transition-all hover:rotate-90"><X size={20} /></button>
            
            <h2 className="text-3xl font-bold text-main mb-2">Eserini Dışa Aktar</h2>
            <p className="text-muted text-sm mb-10">Senaryonu stüdyolara, ajanslara veya yönetmene göndermek için en uygun formatı seç.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => { exportToPDF(project); setIsExportModalOpen(false); }} className="bg-background border border-border hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 group transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(239,68,68,0.2)]">
                <div className="bg-red-500/10 p-5 rounded-full text-red-500 group-hover:scale-110 transition-transform"><FileText size={36}/></div>
                <div className="text-center">
                  <h3 className="font-bold text-main mb-2">Gelişmiş PDF</h3>
                  <p className="text-xs text-muted leading-relaxed">Senopsis, Karakterler ve Senaryo Hollywood A4 standartlarında kitap gibi basılır.</p>
                </div>
              </button>

              <button onClick={() => { exportToSenaryo(project); setIsExportModalOpen(false); }} className="bg-background border border-border hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 group transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]">
                <div className="bg-blue-500/10 p-5 rounded-full text-blue-500 group-hover:scale-110 transition-transform"><Archive size={36}/></div>
                <div className="text-center">
                  <h3 className="font-bold text-main mb-2">Proje Dosyası</h3>
                  <p className="text-xs text-muted leading-relaxed">Sesler ve resimler dahil her şeyi <b>.senaryo</b> uzantılı tek bir dosyaya sıkıştırır.</p>
                </div>
              </button>

              <button onClick={() => { exportToFountain(project); setIsExportModalOpen(false); }} className="bg-background border border-border hover:border-amber-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 group transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
                <div className="bg-amber-500/10 p-5 rounded-full text-amber-500 group-hover:scale-110 transition-transform"><FileCode size={36}/></div>
                <div className="text-center">
                  <h3 className="font-bold text-main mb-2">Fountain</h3>
                  <p className="text-xs text-muted leading-relaxed">Sadece senaryo metnini Final Draft veya Celtx programlarında açılacak şekilde verir.</p>
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
    <button onClick={() => set(id)} className={`w-full text-left px-5 py-3.5 text-sm rounded-xl transition-all font-bold tracking-wide ${isActive ? 'bg-accent text-white shadow-md shadow-accent/20 translate-x-1' : 'text-muted hover:bg-hover hover:text-main'}`}>
      {name}
    </button>
  );
}