import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore';
import DashboardView from './DashboardView';
import { Loader2 } from 'lucide-react'; 

export default function Dashboard() {
  const { projects, addProject, importProject, setActiveProject, deleteProject, isHydrated } = useProjectStore();
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Dosya seçici için

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

  // YENİ: .senaryo Dosyasını Okuma
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedProject = JSON.parse(event.target.result);
        if (parsedProject && parsedProject.title) {
          importProject(parsedProject);
          alert("Proje başarıyla içe aktarıldı!");
        } else {
          alert("Geçersiz veya bozuk bir .senaryo dosyası seçtiniz.");
        }
      } catch (err) {
        alert("Dosya okunamadı! Sadece .senaryo uzantılı JSON dosyaları desteklenir.");
      }
    };
    reader.readAsText(file);
    // Aynı dosyayı tekrar seçebilmek için inputu sıfırla
    e.target.value = null; 
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <DashboardView 
      projects={projects}
      newTitle={newTitle}
      setNewTitle={setNewTitle}
      handleCreate={handleCreate}
      handleOpenProject={handleOpenProject}
      deleteProject={deleteProject}
      fileInputRef={fileInputRef}
      handleFileUpload={handleFileUpload}
      triggerFileInput={triggerFileInput}
    />
  );
}