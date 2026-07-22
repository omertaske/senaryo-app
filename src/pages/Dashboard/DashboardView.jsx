import { Plus, FileText, Trash2, Upload } from 'lucide-react';

export default function DashboardView({ 
  projects, newTitle, setNewTitle, handleCreate, handleOpenProject, deleteProject,
  fileInputRef, handleFileUpload, triggerFileInput // Yeni Proplar
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Senaryo Projelerim</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <form onSubmit={handleCreate} className="flex flex-1 gap-4">
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Yeni Proje Adı..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-4 text-lg focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg flex items-center gap-2 font-semibold transition-colors shadow-lg">
              <Plus size={24} /> Oluştur
            </button>
          </form>

          {/* YENİ: İÇE AKTAR BUTONU */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-4 flex items-center">
            <input type="file" accept=".senaryo, application/json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={triggerFileInput} className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors shadow-lg">
              <Upload size={20} /> Proje İçe Aktar (.senaryo)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} onClick={() => handleOpenProject(project.id)} className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-blue-500 cursor-pointer transition-all group relative shadow-lg hover:-translate-y-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  if(window.confirm('Projeyi silmek istediğine emin misin?')) deleteProject(project.id);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 p-2 rounded-full"
                title="Projeyi Sil"
              >
                <Trash2 size={16} />
              </button>
              <FileText className="text-gray-500 group-hover:text-blue-400 mb-4" size={32} />
              <h2 className="text-xl font-bold truncate">{project.title}</h2>
              <p className="text-sm text-gray-400 mt-2">Son düzenleme: {new Date(project.lastModified).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}