import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore';
import DashboardView from './DashboardView';
import { Loader2 } from 'lucide-react'; // Yükleniyor ikonu

export default function Dashboard() {
  // isHydrated kilidini de içeri çektik
  const { projects, addProject, setActiveProject, deleteProject, isHydrated } = useProjectStore();
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  // YENİ: Veritabanı devasa olduğu için saniyenin onda biri kadar yüklenmesini bekliyoruz.
  // Bu sayede eski projelerin "yokmuş" gibi davranmasını ve üstüne yazılmasını engelledik!
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-gray-400 font-mono uppercase tracking-widest text-sm">Gigabaytlık Veritabanı Hazırlanıyor...</p>
      </div>
    );
  }

  const handleCreate = (e) => {
    e.preventDefault();
    if(newTitle.trim()) {
      addProject(newTitle);
      setNewTitle("");
    }
  };

  const handleOpenProject = (id) => {
    setActiveProject(id);
    navigate(`/editor/${id}`);
  };

  return (
    <DashboardView 
      projects={projects}
      newTitle={newTitle}
      setNewTitle={setNewTitle}
      handleCreate={handleCreate}
      handleOpenProject={handleOpenProject}
      deleteProject={deleteProject}
    />
  );
}