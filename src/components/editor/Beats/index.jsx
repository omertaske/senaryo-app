import { useState } from 'react';
import { useProjectStore } from '../../../store/useProjectStore';
import { v4 as uuidv4 } from 'uuid';
import BeatsView from './BeatsView';

export default function Beats() {
  const { activeProject, updateActiveProject } = useProjectStore();

  // Eğer projede hiç pano verisi yoksa, klasik 3 Perde yapısıyla başlat
  const defaultSequences = [
    { id: uuidv4(), title: '1. PERDE (Kurulum)', beats: [] },
    { id: uuidv4(), title: '2. PERDE (Çatışma)', beats: [] },
    { id: uuidv4(), title: '3. PERDE (Çözüm)', beats: [] }
  ];

  const sequences = activeProject?.sequences?.length > 0 ? activeProject.sequences : defaultSequences;

  const [draggedBeat, setDraggedBeat] = useState(null);
  const [editingBeat, setEditingBeat] = useState(null); 

  const saveSequences = (newSequences) => {
    updateActiveProject({ sequences: newSequences });
  };

  // SÜTUN (SEKANS) İŞLEMLERİ
  const addSequence = () => {
    const newSeq = { id: uuidv4(), title: 'YENİ SEKANS', beats: [] };
    saveSequences([...sequences, newSeq]);
  };

  const updateSequenceTitle = (id, newTitle) => {
    saveSequences(sequences.map(seq => seq.id === id ? { ...seq, title: newTitle } : seq));
  };

  const deleteSequence = (id) => {
    if(window.confirm('Bu sekansı ve içindeki TÜM kartları silmek istediğinize emin misiniz?')) {
      saveSequences(sequences.filter(seq => seq.id !== id));
    }
  };

  // KART (BEAT) İŞLEMLERİ
  const addBeat = (seqId) => {
    const newBeat = { id: uuidv4(), title: 'Yeni Olay / Beat', description: '', color: 'bg-gray-600' };
    saveSequences(sequences.map(seq => 
      seq.id === seqId ? { ...seq, beats: [...seq.beats, newBeat] } : seq
    ));
    setEditingBeat({ seqId, beat: newBeat }); 
  };

  const updateBeat = (seqId, updatedBeat) => {
    saveSequences(sequences.map(seq => 
      seq.id === seqId 
        ? { ...seq, beats: seq.beats.map(b => b.id === updatedBeat.id ? updatedBeat : b) }
        : seq
    ));
    setEditingBeat(null);
  };

  const deleteBeat = (seqId, beatId) => {
    if(window.confirm('Bu kartı silmek istediğinize emin misiniz?')) {
      saveSequences(sequences.map(seq => 
        seq.id === seqId ? { ...seq, beats: seq.beats.filter(b => b.id !== beatId) } : seq
      ));
      setEditingBeat(null);
    }
  };

  // SÜRÜKLE - BIRAK (DRAG & DROP) İŞLEMLERİ
  const handleDragStart = (e, seqId, beat) => {
    setDraggedBeat({ seqId, beat });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedBeat(null);
  };

  const handleDrop = (e, targetSeqId) => {
    e.preventDefault();
    if (!draggedBeat) return;
    const { seqId: sourceSeqId, beat } = draggedBeat;

    if (sourceSeqId === targetSeqId) return;

    const newSequences = sequences.map(seq => {
      if (seq.id === sourceSeqId) {
        return { ...seq, beats: seq.beats.filter(b => b.id !== beat.id) };
      }
      if (seq.id === targetSeqId) {
        return { ...seq, beats: [...seq.beats, beat] };
      }
      return seq;
    });

    saveSequences(newSequences);
    setDraggedBeat(null);
  };

  return (
    <BeatsView 
      sequences={sequences}
      addSequence={addSequence}
      updateSequenceTitle={updateSequenceTitle}
      deleteSequence={deleteSequence}
      addBeat={addBeat}
      updateBeat={updateBeat}
      deleteBeat={deleteBeat}
      editingBeat={editingBeat}
      setEditingBeat={setEditingBeat}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
      handleDrop={handleDrop}
    />
  );
}