import { useProjectStore } from '../../../store/useProjectStore';
import { v4 as uuidv4 } from 'uuid';
import CatalogsView from './CatalogsView';

export default function Catalogs() {
  const { activeProject, updateActiveProject } = useProjectStore();

  const catalogs = activeProject?.catalogs || [];

  const addCatalogItem = () => {
    const newItem = {
      id: uuidv4(),
      title: '',
      type: 'Not', // Not, Link, Resim
      content: ''
    };
    updateActiveProject({ catalogs: [...catalogs, newItem] });
  };

  const updateCatalogItem = (id, field, value) => {
    const updatedCatalogs = catalogs.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateActiveProject({ catalogs: updatedCatalogs });
  };

  const deleteCatalogItem = (id) => {
    const updatedCatalogs = catalogs.filter(item => item.id !== id);
    updateActiveProject({ catalogs: updatedCatalogs });
  };

  return (
    <CatalogsView
      catalogs={catalogs}
      addCatalogItem={addCatalogItem}
      updateCatalogItem={updateCatalogItem}
      deleteCatalogItem={deleteCatalogItem}
    />
  );
}