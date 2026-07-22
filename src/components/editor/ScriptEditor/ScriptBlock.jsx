import { forwardRef, useState, useEffect, useRef } from 'react';

// TÜRKÇE KARAKTER SORUNUNU KESİN ÇÖZEN FONKSİYON
const trUpper = (str) => str ? str.toLocaleUpperCase('tr-TR') : '';

const ScriptBlock = forwardRef(({ 
  block, index, updateBlock, handleKeyDown, characters, catalogs, locations, openRightDrawer 
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
  const typedText = trUpper(block.text.trim());
  const cleanSceneSearch = isScene ? typedText.replace(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/i, '').split('-')[0].trim() : '';

  let suggestions = [];
  if (isChar && typedText.length > 0) {
    suggestions = characters.filter(c => trUpper(c.name).includes(typedText) && trUpper(c.name) !== typedText);
  } else if (isScene && cleanSceneSearch.length > 0) {
    suggestions = locations.filter(l => trUpper(l.name).includes(cleanSceneSearch) && trUpper(l.name) !== cleanSceneSearch);
  }

  useEffect(() => setSelectedIndex(0), [typedText]);

  const applySuggestion = (selected) => {
    if (isChar) {
      updateBlock(block.id, trUpper(selected.name));
    } else if (isScene) {
      const prefixMatch = trUpper(block.text).match(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      updateBlock(block.id, prefix + trUpper(selected.name));
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

  // ÇEKMECEYİ AÇAN FONKSİYON
  const handleMouseUp = (e) => {
    if ((e.ctrlKey || e.metaKey) && openRightDrawer) {
      const text = trUpper(e.target.value);
      const cursorPos = e.target.selectionStart;

      if (isChar) {
        const found = characters.find(c => trUpper(c.name) === typedText);
        if (found) return openRightDrawer('character', found);
      }
      if (isScene) {
        const found = locations.find(l => trUpper(l.name) === cleanSceneSearch);
        if (found) return openRightDrawer('location', found);
      }
      
      if (catalogs && catalogs.length > 0) {
        // En uzun kelimeleri önce arıyoruz ki çakışma olmasın
        const sortedCatalogs = [...catalogs].sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));

        for (let item of sortedCatalogs) {
          if (!item.name) continue;
          const itemName = trUpper(item.name).trim();
          if (itemName.length === 0) continue;

          let startIndex = 0;
          let indexFound;
          while ((indexFound = text.indexOf(itemName, startIndex)) > -1) {
            if (cursorPos >= indexFound && cursorPos <= indexFound + itemName.length) {
              e.preventDefault();
              return openRightDrawer('catalog', item); // Büyük Modal yerine ÇEKMECE açılır
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
        onMouseUp={handleMouseUp} 
        title="Ctrl+Tık ile sağ çekmeceyi aç"
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
              {trUpper(s.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ScriptBlock.displayName = 'ScriptBlock';
export default ScriptBlock;