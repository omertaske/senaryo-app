import { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProjectStore } from '../../../store/useProjectStore';
import ScriptEditorView from './ScriptEditorView';

const BLOCK_TYPES = ['action', 'character', 'dialogue', 'parenthetical', 'scene'];

export default function ScriptEditor({ setActiveTab }) {
  const { activeProject, updateActiveProject, setTempEditTarget } = useProjectStore();

  const episodes = activeProject?.episodes?.length > 0 
    ? activeProject.episodes 
    : [{ 
        id: uuidv4(), 
        title: 'Bölüm 1', 
        scenes: activeProject?.scenes?.length > 0 ? activeProject.scenes : [{ id: uuidv4(), type: 'scene', text: '' }] 
      }];

  const [activeEpId, setActiveEpId] = useState(episodes[0].id);
  const currentEpisode = episodes.find(e => e.id === activeEpId) || episodes[0];
  const blocks = currentEpisode.scenes.length > 0 ? currentEpisode.scenes : [{ id: uuidv4(), type: 'scene', text: '' }];

  const inputRefs = useRef({});
  const [focusId, setFocusId] = useState(null);
  
  const [pendingItem, setPendingItem] = useState(null);
  const characters = activeProject?.characters || [];
  const locations = activeProject?.locations || [];
  const catalogs = activeProject?.catalogs || []; 
  
  // STATELER: Büyük Önizleme ve Sağ Çekmece
  const [quickPreview, setQuickPreview] = useState(null);
  const [rightDrawerItem, setRightDrawerItem] = useState(null); // YENİ: Çekmece State'i

  const [showRoadmap, setShowRoadmap] = useState(false);
  const sequences = activeProject?.sequences || [];

  const openQuickPreview = (type, data) => setQuickPreview({ type, data });
  const closeQuickPreview = () => setQuickPreview(null);

  // YENİ: Çekmeceyi açan fonksiyon
  const openRightDrawer = (type, data) => setRightDrawerItem({ type, data });
  
  const goToEdit = (type, id) => {
    setTempEditTarget(type, id); 
    setQuickPreview(null); 
    setRightDrawerItem(null); // Düzenlemeye gidince çekmeceyi kapat
    if (type === 'character') setActiveTab('characters'); 
    if (type === 'location') setActiveTab('locations');
  };

  useEffect(() => {
    if (focusId) {
      setTimeout(() => {
        const el = inputRefs.current[focusId];
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
          el.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
          setFocusId(null);
        }
      }, 0);
    }
  }, [focusId, blocks.length]);

  const saveBlocks = (newBlocks) => {
    const updatedEpisodes = episodes.map(ep => ep.id === activeEpId ? { ...ep, scenes: newBlocks } : ep);
    updateActiveProject({ episodes: updatedEpisodes, scenes: newBlocks }); 
  };

  const updateBlock = (id, newText) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, text: newText } : b);
    saveBlocks(newBlocks);
  };

  const addNewEpisode = () => {
    const newEpId = uuidv4();
    const newEp = { id: newEpId, title: `Bölüm ${episodes.length + 1}`, scenes: [{ id: uuidv4(), type: 'scene', text: '' }] };
    updateActiveProject({ episodes: [...episodes, newEp] });
    setActiveEpId(newEpId);
  };

  const deleteEpisode = (id) => {
    if (episodes.length === 1) {
      alert("Senaryoda en az 1 bölüm bulunmalıdır.");
      return;
    }
    if (window.confirm("Bu bölümü ve içindeki tüm sahneleri silmek istediğinize emin misiniz?")) {
      const updatedEpisodes = episodes.filter(ep => ep.id !== id);
      updateActiveProject({ episodes: updatedEpisodes });
      if (activeEpId === id) setActiveEpId(updatedEpisodes[0].id);
    }
  };

  const confirmAddItem = () => {
    if (pendingItem?.type === 'character') {
      const newChar = { id: uuidv4(), name: pendingItem.name, role: '', description: '' };
      updateActiveProject({ characters: [...characters, newChar] });
    } else if (pendingItem?.type === 'location') {
      const newLoc = { id: uuidv4(), name: pendingItem.name, setting: '', description: '' };
      updateActiveProject({ locations: [...locations, newLoc] });
    }
    setPendingItem(null);
  };

  const handleKeyDown = (e, index, block) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextType = BLOCK_TYPES[(BLOCK_TYPES.indexOf(block.type) + 1) % BLOCK_TYPES.length];
      const newBlocks = [...blocks];
      newBlocks[index].type = nextType;
      saveBlocks(newBlocks);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (block.type === 'character') {
        const typedName = block.text.trim().toUpperCase();
        if (typedName && !characters.some(c => c.name.toUpperCase() === typedName)) {
          setPendingItem({ type: 'character', name: typedName });
        }
      } else if (block.type === 'scene') {
        const typedText = block.text.trim().toUpperCase();
        const cleanName = typedText.replace(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/, '').split('-')[0].trim();
        if (cleanName && !locations.some(l => l.name.toUpperCase() === cleanName)) {
          setPendingItem({ type: 'location', name: cleanName });
        }
      }

      let nextType = 'action'; 
      if (block.type === 'character') nextType = 'dialogue';
      if (block.type === 'dialogue') nextType = 'character'; 
      if (block.type === 'parenthetical') nextType = 'dialogue';
      if (block.type === 'scene') nextType = 'action';

      const newId = uuidv4(); 
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, { id: newId, type: nextType, text: '' }); 
      
      saveBlocks(newBlocks);
      setFocusId(newId);
    }

    if (e.key === 'Backspace' && block.text === '') {
      e.preventDefault();
      if (blocks.length > 1) { 
        const newBlocks = blocks.filter((_, i) => i !== index);
        saveBlocks(newBlocks);
        setFocusId(blocks[index > 0 ? index - 1 : 0].id);
      }
    }

    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      setFocusId(blocks[index - 1].id);
    }
    if (e.key === 'ArrowDown' && index < blocks.length - 1) {
      e.preventDefault();
      setFocusId(blocks[index + 1].id);
    }
  };

  return (
    <ScriptEditorView 
      blocks={blocks}
      updateBlock={updateBlock}
      handleKeyDown={handleKeyDown}
      inputRefs={inputRefs}
      characters={characters}
      locations={locations}
      catalogs={catalogs}
      pendingItem={pendingItem}
      confirmAddItem={confirmAddItem}
      cancelAddItem={() => setPendingItem(null)}
      episodes={episodes}
      activeEpId={activeEpId}
      setActiveEpId={setActiveEpId}
      addNewEpisode={addNewEpisode}
      deleteEpisode={deleteEpisode}
      setActiveTab={setActiveTab}
      quickPreview={quickPreview}
      openQuickPreview={openQuickPreview}
      closeQuickPreview={closeQuickPreview}
      goToEdit={goToEdit}
      showRoadmap={showRoadmap}
      setShowRoadmap={setShowRoadmap}
      sequences={sequences}
      rightDrawerItem={rightDrawerItem} // YENİ EKLENDİ
      setRightDrawerItem={setRightDrawerItem} // YENİ EKLENDİ
      openRightDrawer={openRightDrawer} // YENİ EKLENDİ
    />
  );
}