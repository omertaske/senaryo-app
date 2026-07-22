import { useState } from 'react';
import { useProjectStore } from '../../../store/useProjectStore';
import { v4 as uuidv4 } from 'uuid';
import CatalogView from './CatalogsView';

export default function Catalog() {
  const { activeProject, updateActiveProject } = useProjectStore();

  // Projede katalog verisi yoksa boş başlat
  const catalogs = activeProject?.catalogs || [];

  const [viewMode, setViewMode] = useState('grid');
  const [activeItemId, setActiveItemId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, prop, vehicle, lore, music

  const addItem = () => {
    const newItem = {
      id: uuidv4(),
      name: '',
      category: 'prop', // prop (Eşya), vehicle (Araç), lore (Kural), music (Müzik)
      description: '',
      importance: 'Normal', // Normal, Kritik, Arka Plan
      photos: [] // Sınırsız IndexedDB sayesinde fotoğraf yükleyebiliriz
    };
    updateActiveProject({ catalogs: [...catalogs, newItem] });
    setActiveItemId(newItem.id);
    setViewMode('edit');
  };

  const updateItem = (id, field, value) => {
    const updatedCatalogs = catalogs.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateActiveProject({ catalogs: updatedCatalogs });
  };

  const deleteItem = (id) => {
    if(window.confirm('Bu öğeyi katalogdan tamamen silmek istediğinize emin misiniz?')) {
      const updatedCatalogs = catalogs.filter(item => item.id !== id);
      updateActiveProject({ catalogs: updatedCatalogs });
      setViewMode('grid');
    }
  };

  const openEdit = (id) => {
    setActiveItemId(id);
    setViewMode('edit');
  };

  const goBack = () => {
    setActiveItemId(null);
    setViewMode('grid');
  };

  return (
    <CatalogView 
      catalogs={catalogs}
      filter={filter}
      setFilter={setFilter}
      viewMode={viewMode}
      activeItemId={activeItemId}
      addItem={addItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      openEdit={openEdit}
      goBack={goBack}
    />
  );
}