// 1. .SENARYO (JSON) DIŞA AKTARIM (GÖNDERMEK İÇİN)
export const exportToSenaryo = (project) => {
  if (!project) return;
  const dataStr = JSON.stringify(project);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.title.replace(/\s+/g, '_')}.senaryo`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 2. FOUNTAIN (STANDART SENARYO) DIŞA AKTARIM
export const exportToFountain = (project) => {
  if (!project || !project.episodes) return;
  let fountainText = `Title: ${project.title}\n\n====\n\n`;

  project.episodes.forEach(ep => {
    fountainText += `\n# ${ep.title.toUpperCase()}\n\n`;
    ep.scenes.forEach(block => {
      const text = block.text.trim();
      if (!text) return;
      switch (block.type) {
        case 'scene': fountainText += `\n${text.toUpperCase()}\n\n`; break;
        case 'character': fountainText += `\n${text.toUpperCase()}\n`; break;
        case 'parenthetical': fountainText += `(${text})\n`; break;
        case 'dialogue': fountainText += `${text}\n\n`; break;
        case 'action': default: fountainText += `${text}\n\n`; break;
      }
    });
  });

  const blob = new Blob([fountainText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.title.replace(/\s+/g, '_')}.fountain`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 3. GELİŞMİŞ PDF DIŞA AKTARIM (HTML YAZDIRMA MOTORU)
export const exportToPDF = (project) => {
  if (!project) return;

  // Hollywood senaryo CSS formatları
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');
    body { font-family: 'Arial', sans-serif; color: #000; line-height: 1.6; padding: 0; margin: 0; background: white; }
    .page-break { page-break-after: always; }
    .title-page { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .title { font-size: 48px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }
    h1 { font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-top: 40px; text-transform: uppercase; }
    h2 { font-size: 20px; margin-top: 30px; }
    .content-box { margin-bottom: 20px; }
    
    /* Script (Senaryo) Formatı */
    .script-page { font-family: 'Courier Prime', 'Courier New', Courier, monospace; font-size: 12pt; line-height: 1.2; max-width: 800px; margin: 0 auto; }
    .s-scene { font-weight: bold; text-transform: uppercase; margin-top: 30px; margin-bottom: 10px; }
    .s-action { margin-bottom: 15px; text-align: justify; }
    .s-character { font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-left: 35%; width: 40%; text-align: center; }
    .s-parenthetical { font-style: italic; margin-left: 30%; width: 50%; text-align: center; }
    .s-dialogue { margin-left: 20%; width: 60%; text-align: center; margin-bottom: 15px; }
    
    @media print {
      body { margin: 1cm; }
      .page-break { page-break-after: always; display: block; }
    }
  `;

  let html = `<!DOCTYPE html><html><head><title>${project.title}</title><style>${css}</style></head><body>`;

  // 1. BAŞLIK SAYFASI
  html += `<div class="title-page"><div class="title">${project.title}</div><p>Yazan</p><p><strong>Senaryo Editörü (senaryo-app)</strong></p></div><div class="page-break"></div>`;

  // 2. SİNOPSİS
  if (project.synopsis) {
    html += `<h1>SİNOPSİS</h1><div class="content-box" style="white-space: pre-wrap; font-size: 14pt;">${project.synopsis}</div><div class="page-break"></div>`;
  }

  // 3. TRETMAN
  if (project.treatment) {
    html += `<h1>TRETMAN</h1><div class="content-box" style="white-space: pre-wrap; font-size: 14pt;">${project.treatment}</div><div class="page-break"></div>`;
  }

  // 4. SEKANS VE BEAT'LER (YOL HARİTASI)
  if (project.sequences && project.sequences.length > 0) {
    html += `<h1>HİKAYE HARİTASI (SEKANSLAR)</h1>`;
    project.sequences.forEach(seq => {
      html += `<h2>${seq.title}</h2><ul>`;
      seq.beats.forEach(beat => {
        html += `<li><strong>${beat.title}:</strong> ${beat.description || ''}</li>`;
      });
      html += `</ul>`;
    });
    html += `<div class="page-break"></div>`;
  }

  // 5. KARAKTERLER
  if (project.characters && project.characters.length > 0) {
    html += `<h1>KARAKTERLER</h1>`;
    project.characters.forEach(c => {
      html += `<div class="content-box"><strong>${c.name.toUpperCase()}</strong> - ${c.profession || 'Rol Yok'}<br><em>${c.goal ? 'Amacı: ' + c.goal : ''}</em><br>${c.description ? '<p>' + c.description + '</p>' : ''}</div>`;
    });
    html += `<div class="page-break"></div>`;
  }

  // 6. MEKANLAR VE KATALOGLAR
  if (project.locations && project.locations.length > 0) {
    html += `<h1>MEKANLAR</h1>`;
    project.locations.forEach(l => {
      html += `<div class="content-box"><strong>${l.name.toUpperCase()}</strong> (${l.setting})<br><em>${l.timeOfDay ? 'Zaman: ' + l.timeOfDay : ''}</em><br>${l.description ? '<p>' + l.description + '</p>' : ''}</div>`;
    });
    html += `<div class="page-break"></div>`;
  }

  // 7. SENARYO (BÖLÜMLER VE SAHNELER)
  html += `<h1>SENARYO</h1><div class="script-page">`;
  const episodes = project.episodes || [];
  episodes.forEach(ep => {
    html += `<h2 style="text-align:center; border-bottom:1px solid #000; padding-bottom:10px;">${ep.title.toUpperCase()}</h2>`;
    
    ep.scenes.forEach(block => {
      const text = block.text.trim();
      if (!text) return;

      if (block.type === 'scene') html += `<div class="s-scene">${text}</div>`;
      else if (block.type === 'character') html += `<div class="s-character">${text}</div>`;
      else if (block.type === 'parenthetical') html += `<div class="s-parenthetical">(${text})</div>`;
      else if (block.type === 'dialogue') html += `<div class="s-dialogue">${text}</div>`;
      else html += `<div class="s-action">${text}</div>`;
    });
    html += `<div class="page-break"></div>`;
  });
  
  html += `</div></body></html>`;

  // Yeni sekmede aç ve yazdır!
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Resimler vb. yüklensin diye çok kısa bekleyip yazdırma diyaloğunu açıyoruz
  setTimeout(() => {
    printWindow.print();
  }, 500);
};