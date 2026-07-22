export const exportToFountain = (project) => {
  if (!project || !project.scenes) return;

  // Başlık sayfası için temel yapı
  let fountainText = `Title: ${project.title}\n\n====\n\n`;

  project.scenes.forEach(block => {
    const text = block.text.trim();
    if (!text) return;

    // Blok türüne göre evrensel senaryo (Fountain) formatına çevir
    switch (block.type) {
      case 'scene':
        fountainText += `\n${text.toUpperCase()}\n\n`;
        break;
      case 'character':
        fountainText += `\n${text.toUpperCase()}\n`;
        break;
      case 'parenthetical':
        fountainText += `(${text})\n`;
        break;
      case 'dialogue':
        fountainText += `${text}\n\n`;
        break;
      case 'action':
      default:
        fountainText += `${text}\n\n`;
        break;
    }
  });

  // Tarayıcıda anında dosya oluşturup indirme sihirbazı
  const blob = new Blob([fountainText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Dosya adını projenin adından al, boşlukları alt tire yap
  const fileName = project.title.replace(/\s+/g, '_') || 'Senaryo';
  link.download = `${fileName}.fountain`; // .fountain uzantısı tüm senaryo programlarında açılır
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};