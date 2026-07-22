import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore';
import EditorLayoutView from './EditorLayoutView';

export default function EditorLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // updateActiveProject eklendi
  const { activeProject, setActiveProject, updateActiveProject } = useProjectStore(); 
  
  const [activeTab, setActiveTab] = useState('script'); 
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    if (id) setActiveProject(id);
  }, [id, setActiveProject]);

  const handleGoHome = () => navigate('/');

  // YENİ: İsim değiştirme fonksiyonu
  const handleRenameProject = (newTitle) => {
     updateActiveProject({ title: newTitle });
  };

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-xl mb-4">Proje yükleniyor veya bulunamadı...</p>
        <button onClick={handleGoHome} className="text-blue-400 underline">Ana Sayfaya Dön</button>
      </div>
    );
  }

  return (
    <EditorLayoutView 
      project={activeProject}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleGoHome={handleGoHome}
      isExportModalOpen={isExportModalOpen}
      setIsExportModalOpen={setIsExportModalOpen}
      handleRenameProject={handleRenameProject} // YENİ: Fonksiyonu View'a gönderiyoruz
    />
  );
}