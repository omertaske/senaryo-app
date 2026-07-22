import { forwardRef, useState, useEffect, useRef } from 'react';

const ScriptBlock = forwardRef(({ 
  block, 
  index, 
  updateBlock, 
  handleKeyDown,
  characters,
  catalogs, // YENİ: Katalog verilerini ScriptBlock'a prop olarak geçiyoruz
  locations,
  openQuickPreview // YENİ: Ctrl+Tık ışınlanması için sekmeyi değiştiren fonksiyon
}, ref) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // localRef: React'in dışarıdan gelen ref'i bozmasını engellemek ve focus() işlemini 
  // garantiye almak için kullandığımız iç referansımız.
  const localRef = useRef(null);

  // Kutu boyutunu (height) içindeki yazıya göre dinamik olarak ayarlama
  useEffect(() => {
    if (localRef.current) {
      localRef.current.style.height = 'auto';
      localRef.current.style.height = localRef.current.scrollHeight + 'px';
    }
  }, [block.text]);

  // Hem dışarıdan gelen ref'i hem kendi localRef'imizi aynı anda textarea'ya bağlama sihirbazı
  const setRefs = (el) => {
    localRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    updateBlock(block.id, e.target.value);
  };

  const isChar = block.type === 'character';
  const isScene = block.type === 'scene';
  const typedText = block.text.trim().toUpperCase();

  // Mekan ararken "İÇ. " kısmını yoksaymak için temiz isim çıkartıyoruz
  const cleanSceneSearch = isScene ? typedText.replace(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/i, '').split('-')[0].trim() : '';

  let suggestions = [];
  
  // Öneri listesini filtreleme (Büyük/Küçük harf duyarlılığı kaldırıldı)
  if (isChar && typedText.length > 0) {
    suggestions = characters.filter(c => c.name.toUpperCase().includes(typedText) && c.name.toUpperCase() !== typedText);
  } else if (isScene && cleanSceneSearch.length > 0) {
    suggestions = locations.filter(l => l.name.toUpperCase().includes(cleanSceneSearch) && l.name.toUpperCase() !== cleanSceneSearch);
  }

  // Yazı değiştikçe seçili index'i sıfırla ki liste başa dönsün
  useEffect(() => {
    setSelectedIndex(0);
  }, [typedText]);

  // Menüden bir öneri seçildiğinde çalışacak fonksiyon
  const applySuggestion = (selected) => {
    if (isChar) {
      updateBlock(block.id, selected.name.toUpperCase());
    } else if (isScene) {
      const prefixMatch = block.text.toUpperCase().match(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      updateBlock(block.id, prefix + selected.name.toUpperCase());
    }
    
    // Seçimden sonra imleci cümlenin EN SONUNA koy.
    // DİKKAT: ref.current yerine localRef.current kullanıyoruz (çökme riskini 0'a indirdik)
    setTimeout(() => {
      if (localRef.current) {
        localRef.current.focus();
        localRef.current.setSelectionRange(localRef.current.value.length, localRef.current.value.length);
      }
    }, 0);
  };

  // Yön tuşlarını ve Enter'ı lokal olarak yakalama (Öneri menüsü açıkken)
  const handleLocalKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault(); // Yeni satır açmasını engelle
        applySuggestion(suggestions[selectedIndex]);
        return; // İşlemi bitir, alt satıra geçmesin
      }
    }
    // Menü açık değilse ana klavye dinleyicisine yolla (Enter'a basınca yeni satır açar vs.)
    handleKeyDown(e, index, block);
  };

  // YENİ: Ctrl + Sol Tık İşlemi (Sekmeye Işınlanma)
  const handleMouseClick = (e) => {
    if ((e.ctrlKey || e.metaKey) && openQuickPreview) {
      if (isChar) {
        // Karakteri veritabanında bul (İsmi aynı olanı getir)
        const found = characters.find(c => c.name.toUpperCase() === typedText);
        if (found) openQuickPreview('character', found);
      }
      if (isScene) {
        // Mekanı veritabanında bul
        const found = locations.find(l => l.name.toUpperCase() === cleanSceneSearch);
        if (found) openQuickPreview('location', found);
      }
      if (catalogs && catalogs.length > 0) {
        for (let item of catalogs) {
          const itemName = item.name.toUpperCase();
          const idx = text.indexOf(itemName);
          // Eğer kelime metinde geçiyorsa VE imlecimiz (tıkladığımız yer) o kelimenin üzerindeyse:
          if (idx !== -1 && cursorPos >= idx && cursorPos <= idx + itemName.length) {
            return openQuickPreview('catalog', item); // Katalog multimedya modalını aç!
          }
        }
      }
    }
  };

  // Formatlara göre uygulanan CSS Sınıfları
  const getStyleClass = (type) => {
    switch (type) {
      case 'scene': return 'font-bold uppercase bg-gray-200 dark:bg-gray-800 p-2 mt-6 cursor-text';
      case 'character': return 'font-bold uppercase text-center w-1/2 mx-auto mt-4 cursor-text';
      case 'dialogue': return 'text-center w-3/4 mx-auto';
      case 'parenthetical': return 'italic text-center w-1/2 mx-auto';
      case 'action': default: return 'w-full mt-2';
    }
  };

  return (
    <div className="relative flex flex-col">
      <textarea
        ref={setRefs}
        value={block.text}
        onChange={handleInput}
        onKeyDown={handleLocalKeyDown}
        onClick={handleMouseClick} // Ctrl+Tık dinleyicisi eklendi
        title={(isChar || isScene) ? "Ctrl tuşuna basılı tutarak tıklarsan sekmesine gidersin" : ""} // Hover olunca çıkacak ipucu
        placeholder={block.type.toUpperCase()}
        className={`block resize-none overflow-hidden bg-transparent outline-none text-lg transition-all ${getStyleClass(block.type)}`}
        rows={1}
      />
      
      {/* Otomatik Tamamlama Öneri Menüsü */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-20 overflow-hidden">
          <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1 uppercase tracking-wider">
            {isChar ? 'Karakter Önerisi' : 'Mekan Önerisi'}
          </div>
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              onClick={() => applySuggestion(s)}
              className={`px-4 py-3 cursor-pointer font-bold transition-colors border-b border-gray-700 last:border-0 ${
                i === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {s.name.toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ScriptBlock.displayName = 'ScriptBlock';
export default ScriptBlock;