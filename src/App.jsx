import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import Dashboard from './pages/Dashboard/index';
import EditorLayout from './pages/EditorLayout/index';

export default function App() {
  const { activeTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:id" element={<EditorLayout />} />
      </Routes>
    </BrowserRouter>
  );
}