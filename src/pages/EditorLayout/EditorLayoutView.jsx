import { Home } from 'lucide-react';
import ScriptEditor from '../../components/editor/ScriptEditor';
import Characters from '../../components/editor/Characters';
import Locations from '../../components/editor/Locations';
import Beats from '../../components/editor/Beats';
import Catalogs from '../../components/editor/Catalogs';
import Synopsis from '../../components/editor/Synopsis';
import Treatment from '../../components/editor/Treatment';
import {Download } from 'lucide-react'; 
import { exportToFountain } from '../../lib/exportUtils';
import StorageIndicator from '../../components/StorageIndicator';

export default function EditorLayoutView({ project, activeTab, setActiveTab, handleGoHome }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Sol Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="font-bold text-lg truncate" title={project.title}>
            {project.title}
          </span>
          <button onClick={handleGoHome} className="text-gray-400 hover:text-white transition-colors">
            <Home size={20} />
          </button>
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
        <StorageIndicator />

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => exportToFountain(project)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors shadow-lg"
          >
            <Download size={20} />
            Senaryoyu İndir
          </button>
        </div>
      </aside>

      {/* Sağ Ana İçerik Alanı */}
      <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
        {/* İleride buradaki bileşenleri de ayıracağız */}
        {activeTab === 'script' && <ScriptEditor setActiveTab={setActiveTab}/> }
        {activeTab === 'synopsis' && <Synopsis />}
        {activeTab === 'treatment' && <Treatment />}
        {activeTab === 'characters' &&  <Characters />}
        {activeTab === 'locations' && <Locations />}
        {activeTab === 'beats' && <Beats />}
        {activeTab === 'catalogs' && <Catalogs />}
      </main>
    </div>
  );
}

// Görünüm dosyasına ait küçük alt bileşen
function TabButton({ name, id, current, set }) {
  const isActive = current === id;
  return (
    <button
      onClick={() => set(id)}
      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
      }`}
    >
      {name}
    </button>
  );
}