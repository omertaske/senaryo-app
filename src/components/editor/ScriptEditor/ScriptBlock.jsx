import { forwardRef, useState, useEffect, useRef } from 'react';

const ScriptBlock = forwardRef(({ 
  block, index, updateBlock, handleKeyDown, characters, catalogs, locations, openQuickPreview 
}, ref) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const localRef = useRef(null);

  useEffect(() => {
    if (localRef.current) {
      localRef.current.style.height = 'auto';
      localRef.current.style.height = localRef.current.scrollHeight + 'px';
    }
  }, [block.text]);

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
  const cleanSceneSearch = isScene ? typedText.replace(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/i, '').split('-')[0].trim() : '';

  let suggestions = [];
  if (isChar && typedText.length > 0) {
    suggestions = characters.filter(c => c.name.toUpperCase().includes(typedText) && c.name.toUpperCase() !== typedText);
  } else if (isScene && cleanSceneSearch.length > 0) {
    suggestions = locations.filter(l => l.name.toUpperCase().includes(cleanSceneSearch) && l.name.toUpperCase() !== cleanSceneSearch);
  }

  useEffect(() => setSelectedIndex(0), [typedText]);

  const applySuggestion = (selected) => {
    if (isChar) {
      updateBlock(block.id, selected.name.toUpperCase());
    } else if (isScene) {
      const prefixMatch = block.text.toUpperCase().match(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      updateBlock(block.id, prefix + selected.name.toUpperCase());
    }
    setTimeout(() => {
      if (localRef.current) {
        localRef.current.focus();
        localRef.current.setSelectionRange(localRef.current.value.length, localRef.current.value.length);
      }
    }, 0);
  };

  const handleLocalKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((p) => (p + 1) % suggestions.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((p) => (p - 1 + suggestions.length) % suggestions.length); return; }
      if (e.key === 'Enter') { e.preventDefault(); applySuggestion(suggestions[selectedIndex]); return; }
    }
    handleKeyDown(e, index, block);
  };

  // YENİ: Hata giderildi! onClick yerine onMouseUp (İmleç pozisyonunu garanti almak için)
  const handleMouseUp = (e) => {
    if ((e.ctrlKey || e.metaKey) && openQuickPreview) {
      const text = e.target.value.toUpperCase();
      const cursorPos = e.target.selectionStart;

      if (isChar) {
        const found = characters.find(c => c.name.toUpperCase() === typedText);
        if (found) return openQuickPreview('character', found);
      }
      if (isScene) {
        const found = locations.find(l => l.name.toUpperCase() === cleanSceneSearch);
        if (found) return openQuickPreview('location', found);
      }
      
      if (catalogs && catalogs.length > 0) {
        // En uzun kelimeden en kısasına doğru ara ki "KANLI BIÇAK" kelimesini "BIÇAK" ile karıştırmasın
        const sortedCatalogs = [...catalogs].sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));

        for (let item of sortedCatalogs) {
          if (!item.name) continue;
          const itemName = item.name.toUpperCase().trim();
          if (itemName.length === 0) continue;

          // Kelimenin metindeki yerini bul (Birden fazla kez geçebilir, hepsini tara)
          let startIndex = 0;
          let indexFound;
          while ((indexFound = text.indexOf(itemName, startIndex)) > -1) {
            // İmleç tam o kelimenin üstünde veya içindeyse şovu başlat!
            if (cursorPos >= indexFound && cursorPos <= indexFound + itemName.length) {
              e.preventDefault();
              return openQuickPreview('catalog', item); 
            }
            startIndex = indexFound + itemName.length;
          }
        }
      }
    }
  };

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
        onMouseUp={handleMouseUp} // DEĞİŞTİRİLDİ
        title={(isChar || isScene) ? "Ctrl tuşuna basılı tutarak tıklarsan sekmesine gidersin" : "Katalog objesi ise Ctrl+Tık ile önizle"}
        placeholder={block.type.toUpperCase()}
        className={`block resize-none overflow-hidden bg-transparent outline-none text-lg transition-all ${getStyleClass(block.type)}`}
        rows={1}
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-20 overflow-hidden">
          <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1 uppercase tracking-wider">
            {isChar ? 'Karakter Önerisi' : 'Mekan Önerisi'}
          </div>
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              onClick={() => applySuggestion(s)}
              className={`px-4 py-3 cursor-pointer font-bold transition-colors border-b border-gray-700 last:border-0 ${i === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
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