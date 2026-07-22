import { Plus, FileText, Trash2, Upload, Clapperboard, Sparkles } from 'lucide-react';
import ThemeSelector from '../../components/ThemeSelector';

export default function DashboardView({ 
  projects, newTitle, setNewTitle, handleCreate, handleOpenProject, deleteProject,
  fileInputRef, handleFileUpload, triggerFileInput 
}) {
  return (
    <div className="min-h-screen bg-background text-main p-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* Zarif Header */}
        <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-accent/20 p-3 rounded-2xl border border-accent/30 shadow-[0_0_20px_rgba(var(--color-accent),0.2)]">
              <Clapperboard size={36} className="text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Auteur <span className="font-light text-muted">Studio</span></h1>
              <p className="text-sm text-muted mt-1 font-mono uppercase tracking-widest">Profesyonel Senaryo Yazılımı</p>
            </div>
          </div>
          <div className="w-48"><ThemeSelector /></div>
        </div>
        
        {/* Pazarlama Metni - Yalnızca hiç proje yoksa çıkar */}
        {projects.length === 0 && (
          <div className="bg-panel border border-accent/20 p-8 md:p-12 rounded-3xl mb-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-50 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-main tracking-tight flex items-center gap-3">
                  Hikayeni Gerçeğe Dönüştür! <Sparkles className="text-accent" size={32} />
                </h2>
                <p className="text-muted leading-relaxed text-sm md:text-base">
                  Auteur Studio'ya hoş geldin! Burası, fikirlerini profesyonel bir  senaryosuna dönüştürmen için titizlikle tasarlandı. Sınırsız karakter yarat, mekanları referans görsellerle hayal et ve Mantar Pano (Story Board) ile olay örgünü kusursuzca inşa et. <strong className="text-main">Üstelik hiçbir verin buluta gitmez, tamamen senin tarayıcında güvende kalır.</strong>
                </p>
                <div className="pt-2 text-accent text-sm font-semibold flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                  </span>
                  Aşağıdan ilk projeni oluşturarak hemen yazmaya başla!
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-3 items-end w-56">
                 <div className="bg-accent/10 text-accent font-bold px-4 py-3 rounded-xl text-sm border border-accent/20 w-full text-center shadow-sm">🎭 Akıllı Karakter Önerisi</div>
                 <div className="bg-accent/10 text-accent font-bold px-4 py-3 rounded-xl text-sm border border-accent/20 w-full text-center shadow-sm">🎬 Standart Senaryo Formatı</div>
                 <div className="bg-accent/10 text-accent font-bold px-4 py-3 rounded-xl text-sm border border-accent/20 w-full text-center shadow-sm">🔒 %100 Yerel Güvenlik</div>
              </div>
            </div>
          </div>
        )}

        {/* Oluşturma ve İçe Aktarma Paneli */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 bg-panel p-2 rounded-2xl border border-border shadow-2xl backdrop-blur-md relative z-20">
          <form onSubmit={handleCreate} className="flex flex-1 gap-2 p-2  ">
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Yeni bir hikayeye başla..."
              className="flex-1 bg-background border border-border rounded-xl p-4 text-lg text-main outline-none focus:border-accent transition-all shadow-inner"
            />
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-8 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg hover:-translate-y-0.5">
              <Plus size={24} /> Oluştur
            </button>
          </form>

          <div className="border-t md:border-t-0 md:border-l border-border p-2 flex items-center">
            <input type="file" accept=".senaryo, application/json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={triggerFileInput} className="w-full md:w-auto h-full bg-hover hover:bg-border text-main px-6 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all shadow-md">
              <Upload size={20} className="text-accent" /> .senaryo Aktar
            </button>
          </div>
        </div>

        {/* Projeler Grid'i */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} onClick={() => handleOpenProject(project.id)} className="bg-panel border border-border p-8 rounded-3xl cursor-pointer transition-all duration-300 group relative shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:border-accent hover:-translate-y-2">
              <button 
                onClick={(e) => { e.stopPropagation(); if(window.confirm('Projeyi silmek istediğine emin misin?')) deleteProject(project.id); }}
                className="absolute top-6 right-6 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-background p-2 rounded-full shadow-md"
                title="Projeyi Sil"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:border-accent/50 transition-colors">
                <FileText className="text-muted group-hover:text-accent transition-colors" size={28} />
              </div>
              
              <h2 className="text-2xl font-bold truncate mb-2">{project.title}</h2>
              <div className="flex items-center gap-2 text-xs text-muted font-mono uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Son Düzenleme: {new Date(project.lastModified).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}