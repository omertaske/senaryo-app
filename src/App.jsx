import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Expand, Shrink } from 'lucide-react';
import { useThemeStore } from './store/useThemeStore';
import Dashboard from './pages/Dashboard/index';
import EditorLayout from './pages/EditorLayout/index';

export default function App() {
  const { activeTheme } = useThemeStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // Tam ekran durumunu dinleyen event listener
  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Tam ekranı aç/kapat fonksiyonu
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor/:id" element={<EditorLayout />} />
        </Routes>
      </BrowserRouter>
      
      {/* Sitenin her yerinde duran şeffaf Tam Ekran Butonu */}
      <button
        onClick={toggleFullscreen}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-panel/60 hover:bg-panel text-muted hover:text-accent border border-border hover:border-accent shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all z-[9999] hover:scale-110"
        title={isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran (Fullscreen)"}
      >
        {isFullscreen ? <Shrink size={24} /> : <Expand size={24} />}
      </button>
    </>
  );
}