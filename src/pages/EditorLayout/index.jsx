import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore';
import EditorLayoutView from './EditorLayoutView';

export default function EditorLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeProject, setActiveProject } = useProjectStore();
  
  // Hangi sekmede olduğumuzu tutan state
  const [activeTab, setActiveTab] = useState('script'); 

  // Sayfa yüklendiğinde veya ID değiştiğinde projeyi seç
  useEffect(() => {
    if (id) {
      setActiveProject(id);
    }
  }, [id, setActiveProject]);

  const handleGoHome = () => navigate('/');

  // Proje bulunamadıysa gösterilecek yedek ekran
  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-xl mb-4">Proje yükleniyor veya bulunamadı...</p>
        <button onClick={handleGoHome} className="text-blue-400 underline">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Her şey tamamsa tasarımı render et
  return (
    <EditorLayoutView 
      project={activeProject}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleGoHome={handleGoHome}
    />
  );
}