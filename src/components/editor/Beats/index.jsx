import { useProjectStore } from '../../../store/useProjectStore';
import { v4 as uuidv4 } from 'uuid';
import BeatsView from './BeatsView';

export default function Beats() {
  const { activeProject, updateActiveProject } = useProjectStore();

  // Projede sekanslar (sequences) daha önce kaydedilmemişse, varsayılan 3 Perde yapısını kur.
  const sequences = activeProject?.sequences || [
    { id: uuidv4(), title: 'I. Perde (Kurulum)', beats: [] },
    { id: uuidv4(), title: 'II. Perde (Çatışma)', beats: [] },
    { id: uuidv4(), title: 'III. Perde (Çözüm)', beats: [] }
  ];

  // Yeni Sütun (Sekans) Ekle
  const addSequence = () => {
    const newSeq = { id: uuidv4(), title: 'Yeni Sekans', beats: [] };
    updateActiveProject({ sequences: [...sequences, newSeq] });
  };

  // İlgili Sütuna Yeni Kart (Beat) Ekle
  const addBeat = (sequenceId) => {
    const updatedSequences = sequences.map(seq => {
      if (seq.id === sequenceId) {
        return {
          ...seq,
          beats: [...seq.beats, { id: uuidv4(), title: '', content: '' }]
        };
      }
      return seq;
    });
    updateActiveProject({ sequences: updatedSequences });
  };

  // Kartın İçeriğini Güncelle
  const updateBeat = (sequenceId, beatId, field, value) => {
    const updatedSequences = sequences.map(seq => {
      if (seq.id === sequenceId) {
        return {
          ...seq,
          beats: seq.beats.map(b => b.id === beatId ? { ...b, [field]: value } : b)
        };
      }
      return seq;
    });
    updateActiveProject({ sequences: updatedSequences });
  };

  // Kartı Sil
  const deleteBeat = (sequenceId, beatId) => {
    const updatedSequences = sequences.map(seq => {
      if(seq.id === sequenceId) {
        return { ...seq, beats: seq.beats.filter(b => b.id !== beatId) };
      }
      return seq;
    });
    updateActiveProject({ sequences: updatedSequences });
  };

  // --- SÜRÜKLE BIRAK (DRAG & DROP) SİHRİ ---

  // 1. Kartı tuttuğumuz an (ID'sini hafızaya alıyoruz)
  const onDragStart = (e, sequenceId, beatId) => {
    e.dataTransfer.setData('beatId', beatId);
    e.dataTransfer.setData('sourceSequenceId', sequenceId);
  };

  // 2. Kartın başka bir sütunun üzerine gelmesine izin veriyoruz
  const onDragOver = (e) => {
    e.preventDefault(); 
  };

  // 3. Kartı yeni sütuna bıraktığımız an
  const onDrop = (e, targetSequenceId) => {
    const beatId = e.dataTransfer.getData('beatId');
    const sourceSequenceId = e.dataTransfer.getData('sourceSequenceId');

    if (sourceSequenceId === targetSequenceId) return; // Aynı sütuna bırakıldıysa işlem yapma

    let draggedBeat = null;

    // Önce kartı eski sekansından (sütunundan) bul ve oradan çıkart
    let updatedSequences = sequences.map(seq => {
      if (seq.id === sourceSequenceId) {
        draggedBeat = seq.beats.find(b => b.id === beatId);
        return { ...seq, beats: seq.beats.filter(b => b.id !== beatId) };
      }
      return seq;
    });

    // Sonra o kartı yeni sekansa (sütuna) ekle
    if (draggedBeat) {
      updatedSequences = updatedSequences.map(seq => {
        if (seq.id === targetSequenceId) {
          return { ...seq, beats: [...seq.beats, draggedBeat] };
        }
        return seq;
      });
      updateActiveProject({ sequences: updatedSequences });
    }
  };

  return (
    <BeatsView 
      sequences={sequences}
      addSequence={addSequence}
      addBeat={addBeat}
      updateBeat={updateBeat}
      deleteBeat={deleteBeat}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
    />
  );
}