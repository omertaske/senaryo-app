import { Plus, FileText, Trash2 } from 'lucide-react';

export default function DashboardView({ 
  projects, 
  newTitle, 
  setNewTitle, 
  handleCreate, 
  handleOpenProject,
  deleteProject // Prop olarak karşıladık
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Senaryo Projelerim</h1>
        
        <form onSubmit={handleCreate} className="flex gap-4 mb-12">
          <input 
            type="text" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Yeni Proje Adı..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg flex items-center gap-2 font-semibold transition-colors"
          >
            <Plus size={24} />
            Oluştur
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => handleOpenProject(project.id)}
              className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-blue-500 cursor-pointer transition-all group relative" // RELATIVE EKLENDİ
            >
              
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  if(window.confirm('Projeyi silmek istediğine emin misin?')) deleteProject(project.id);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>

              <FileText className="text-gray-500 group-hover:text-blue-400 mb-4" size={32} />
              <h2 className="text-xl font-bold truncate">{project.title}</h2>
              <p className="text-sm text-gray-400 mt-2">
                Son düzenleme: {new Date(project.lastModified).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}