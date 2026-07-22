import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/index';
import EditorLayout from './pages/EditorLayout/index';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:id" element={<EditorLayout />} />
      </Routes>
    </BrowserRouter>
  );
}