import { forwardRef, useState, useEffect, useRef, memo } from 'react';

const trUpper = (str) => str ? str.toLocaleUpperCase('tr-TR') : '';

const ScriptBlock = forwardRef(({ 
  block, index, updateBlock, handleKeyDown, characters, catalogs, locations, openRightDrawer 
}, ref) => {

  const [localText, setLocalText] = useState(block.text);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const localRef = useRef(null);

  useEffect(() => {
    if (block.text !== localText) {
      setLocalText(block.text);
    }
  }, [block.text]);

  useEffect(() => {
    if (localText === block.text) return; 
    const timer = setTimeout(() => {
      updateBlock(block.id, localText);
    }, 400); 
    return () => clearTimeout(timer);
  }, [localText, block.id, block.text, updateBlock]);

  useEffect(() => {
    if (localRef.current) {
      localRef.current.style.height = 'auto';
      localRef.current.style.height = localRef.current.scrollHeight + 'px';
    }
  }, [localText]);

  const setRefs = (el) => {
    localRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    setLocalText(e.target.value); 
  };

  const isChar = block.type === 'character';
  const isScene = block.type === 'scene';
  const typedText = trUpper(localText.trim()); 
  const cleanSceneSearch = isScene ? typedText.replace(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/i, '').split('-')[0].trim() : '';

  let suggestions = [];
  if (isChar && typedText.length > 0) {
    suggestions = characters.filter(c => trUpper(c.name).includes(typedText) && trUpper(c.name) !== typedText);
  } else if (isScene && cleanSceneSearch.length > 0) {
    suggestions = locations.filter(l => trUpper(l.name).includes(cleanSceneSearch) && trUpper(l.name) !== cleanSceneSearch);
  }

  useEffect(() => setSelectedIndex(0), [typedText]);

  // Fareyle tıklanarak öneri seçildiğinde (Sadece formatlar ve o satırda kalır)
  const applySuggestion = (selected) => {
    if (isChar) {
      setLocalText(trUpper(selected.name));
      updateBlock(block.id, trUpper(selected.name)); 
    } else if (isScene) {
      const settingStr = selected.setting ? selected.setting.toUpperCase() : 'İÇ';
      const timeStr = selected.timeOfDay ? selected.timeOfDay.toUpperCase() : 'GÜNDÜZ';
      const prefix = settingStr.includes('.') ? settingStr : `${settingStr}.`;
      const formattedScene = `${prefix} ${trUpper(selected.name)} - ${timeStr}`;
      
      setLocalText(formattedScene);
      updateBlock(block.id, formattedScene);
    }
    setTimeout(() => {
      if (localRef.current) {
        localRef.current.focus();
        localRef.current.setSelectionRange(localRef.current.value.length, localRef.current.value.length);
      }
    }, 0);
  };

  const handleLocalKeyDown = (e) => {
    // 1. Durum: Ekranda öneri listesi açıksa ve klavye kullanılıyorsa
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((p) => (p + 1) % suggestions.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((p) => (p - 1 + suggestions.length) % suggestions.length); return; }
      if (e.key === 'Enter') { 
        e.preventDefault(); 
        const selected = suggestions[selectedIndex];
        let finalString = localText;
        
        if (isChar) {
          finalString = trUpper(selected.name);
        } else if (isScene) {
          const settingStr = selected.setting ? selected.setting.toUpperCase() : 'İÇ';
          const timeStr = selected.timeOfDay ? selected.timeOfDay.toUpperCase() : 'GÜNDÜZ';
          const prefix = settingStr.includes('.') ? settingStr : `${settingStr}.`;
          finalString = `${prefix} ${trUpper(selected.name)} - ${timeStr}`;
        }
        
        setLocalText(finalString);
        updateBlock(block.id, finalString);

        // Öneriyi Enter ile seçtiğinde direkt alt satıra (Action) geçsin
        handleKeyDown(e, index, { ...block, text: finalString });
        return; 
      }
    }
    
    // 2. Durum: Kullanıcı öneriyi seçmeden, adını tam yazıp "Enter"a basarsa otomatik formatla
    if (e.key === 'Enter') {
       let finalString = localText;
       
       if (isScene) {
           const cleanName = localText.replace(/^(İÇ\.|DIŞ\.|İÇ\/DIŞ\.|İÇ |DIŞ )/i, '').split('-')[0].trim();
           const matchedLoc = locations.find(l => trUpper(l.name) === trUpper(cleanName));
           
           if (matchedLoc) {
               const settingStr = matchedLoc.setting ? matchedLoc.setting.toUpperCase() : 'İÇ';
               const timeStr = matchedLoc.timeOfDay ? matchedLoc.timeOfDay.toUpperCase() : 'GÜNDÜZ';
               const prefix = settingStr.includes('.') ? settingStr : `${settingStr}.`;
               finalString = `${prefix} ${trUpper(matchedLoc.name)} - ${timeStr}`;
               
               setLocalText(finalString);
           }
       }

       if (isChar) {
           const cleanCharName = localText.trim();
           const matchedChar = characters.find(c => trUpper(c.name) === trUpper(cleanCharName));
           if (matchedChar) {
               finalString = trUpper(matchedChar.name);
               setLocalText(finalString);
           }
       }
       
       if (finalString !== block.text) {
         updateBlock(block.id, finalString);
       }
       // Her halükarda yeni satır oluşturmak için ana fonksiyonu tetikle
       handleKeyDown(e, index, { ...block, text: finalString });
       return; 
    }

    if (e.key === 'Tab') {
       if (localText !== block.text) {
         updateBlock(block.id, localText);
       }
       handleKeyDown(e, index, { ...block, text: localText });
       return;
    }
    
    handleKeyDown(e, index, { ...block, text: localText });
  };

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
              return openRightDrawer('catalog', item); 
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
        value={localText}
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
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-700 last:border-0 ${i === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <div className="font-bold">{trUpper(s.name)}</div>
              {isScene && (s.setting || s.timeOfDay) && (
                <div className={`text-[10px] mt-1 font-bold ${i === selectedIndex ? 'text-blue-200' : 'text-emerald-400'}`}>
                  {s.setting ? s.setting.toUpperCase() : 'İÇ.'} - {s.timeOfDay ? s.timeOfDay.toUpperCase() : 'GÜNDÜZ'}
                </div>
              )}
              {isChar && s.profession && (
                <div className={`text-[10px] mt-1 font-bold ${i === selectedIndex ? 'text-blue-200' : 'text-blue-400'}`}>
                  {s.profession.toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ScriptBlock.displayName = 'ScriptBlock';

export default memo(ScriptBlock, (prevProps, nextProps) => {
  return prevProps.block.text === nextProps.block.text &&
         prevProps.block.type === nextProps.block.type &&
         prevProps.index === nextProps.index;
});