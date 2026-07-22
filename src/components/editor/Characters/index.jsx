import { useState, useEffect } from 'react';
import { useProjectStore } from '../../../store/useProjectStore';
import { v4 as uuidv4 } from 'uuid';
import CharactersView from './CharactersView';

export default function Characters() {
  const { activeProject, updateActiveProject , tempEditTarget, clearTempEditTarget } = useProjectStore();

  const characters = activeProject?.characters || [];
  const locations = activeProject?.locations || []; // İlişkilendirme için mekanları da çektik

  // Hangi ekrandayız? 'grid' | 'preview' | 'edit'
  const [viewMode, setViewMode] = useState('grid'); 
  const [activeCharId, setActiveCharId] = useState(null);
  useEffect(() => {
    if (tempEditTarget?.type === 'character') {
      setActiveCharId(tempEditTarget.id);
      setViewMode('edit'); // Doğrudan düzenleme formunu aç
      clearTempEditTarget(); // Görev tamamlandı, hafızayı sil
    }
  }, [tempEditTarget, clearTempEditTarget]);

  const addCharacter = () => {
    const newCharacter = {
      id: uuidv4(),
      name: '',
      role: '',
      profession: '',
      origin: '',
      goal: '',
      relationships: '', // Eş, dost
      residence: '', // Yaşadığı yer
      description: '', // Özgür alan
      photos: [] // Fotoğraf linkleri
    };
    updateActiveProject({ characters: [...characters, newCharacter] });
    setActiveCharId(newCharacter.id);
    setViewMode('edit'); // Ekler eklemez düzeltme ekranına at
  };

  const updateCharacter = (id, field, value) => {
    const updatedCharacters = characters.map(char =>
      char.id === id ? { ...char, [field]: value } : char
    );
    updateActiveProject({ characters: updatedCharacters });
  };

  const deleteCharacter = (id) => {
    if(window.confirm('Bu karakteri silmek istediğinize emin misiniz?')) {
      const updatedCharacters = characters.filter(char => char.id !== id);
      updateActiveProject({ characters: updatedCharacters });
      setViewMode('grid');
    }
  };

  const openPreview = (id) => {
    setActiveCharId(id);
    setViewMode('preview');
  };

  const openEdit = (id) => {
    setActiveCharId(id);
    setViewMode('edit');
  };

  const goBack = () => {
    setActiveCharId(null);
    setViewMode('grid');
  };

  return (
    <CharactersView
      characters={characters}
      locations={locations}
      viewMode={viewMode}
      activeCharId={activeCharId}
      addCharacter={addCharacter}
      updateCharacter={updateCharacter}
      deleteCharacter={deleteCharacter}
      openPreview={openPreview}
      openEdit={openEdit}
      goBack={goBack}
    />
  );
}