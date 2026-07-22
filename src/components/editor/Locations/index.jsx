import { useState, useEffect } from 'react';
import { useProjectStore } from '../../../store/useProjectStore';
import { v4 as uuidv4 } from 'uuid';
import LocationsView from './LocationsView';

export default function Locations() {
  const { activeProject, updateActiveProject , tempEditTarget, clearTempEditTarget} = useProjectStore();

  const locations = activeProject?.locations || [];
  const characters = activeProject?.characters || []; // İlişkilendirme için

  const [viewMode, setViewMode] = useState('grid');
  const [activeLocId, setActiveLocId] = useState(null);

  useEffect(() => {
    if (tempEditTarget?.type === 'location') {
      setActiveLocId(tempEditTarget.id);
      setViewMode('edit'); // Doğrudan düzenleme formunu aç
      clearTempEditTarget(); 
    }
  }, [tempEditTarget, clearTempEditTarget]);

  const addLocation = () => {
    const newLocation = {
      id: uuidv4(),
      name: '',
      setting: 'İÇ', // İÇ, DIŞ, İÇ/DIŞ
      timeOfDay: '', // GÜNDÜZ, GECE, ALACAKARANLIK vs.
      atmosphere: '', // Kasvetli, Dar, Boğucu, Ferah
      lighting: '', // Neon, Loş, Doğal Güneş Işığı, Florasan
      soundscape: '', // Uğultu, Su Damlası, Yoğun Trafik, Sessizlik
      period: '', // Günümüz, 1980'ler, Distopik Gelecek
      keyCharacters: '', // O mekanda en çok kimler bulunur
      description: '', // Serbest betimleme
      photos: [] // Moodboard için referans fotoğraflar
    };
    updateActiveProject({ locations: [...locations, newLocation] });
    setActiveLocId(newLocation.id);
    setViewMode('edit');
  };

  const updateLocation = (id, field, value) => {
    // İsim çakışması kontrolü
    if (field === 'name') {
      const isDuplicate = locations.some(l => l.id !== id && l.name.toUpperCase() === value.toUpperCase());
      if (isDuplicate && value.trim() !== '') {
        alert('Bu isimde bir mekan zaten var!');
        return;
      }
    }
    const updatedLocations = locations.map(loc =>
      loc.id === id ? { ...loc, [field]: value } : loc
    );
    updateActiveProject({ locations: updatedLocations });
  };

  const deleteLocation = (id) => {
    if(window.confirm('Bu mekanı silmek istediğinize emin misiniz?')) {
      const updatedLocations = locations.filter(loc => loc.id !== id);
      updateActiveProject({ locations: updatedLocations });
      setViewMode('grid');
    }
  };

  const openPreview = (id) => {
    setActiveLocId(id);
    setViewMode('preview');
  };

  const openEdit = (id) => {
    setActiveLocId(id);
    setViewMode('edit');
  };

  const goBack = () => {
    setActiveLocId(null);
    setViewMode('grid');
  };

  return (
    <LocationsView
      locations={locations}
      characters={characters}
      viewMode={viewMode}
      activeLocId={activeLocId}
      addLocation={addLocation}
      updateLocation={updateLocation}
      deleteLocation={deleteLocation}
      openPreview={openPreview}
      openEdit={openEdit}
      goBack={goBack}
    />
  );
}