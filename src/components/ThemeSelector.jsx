import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const THEMES = [
  { id: 'midnight', name: 'Gece Yarısı', color: '#0f172a' },
  { id: 'obsidian', name: 'Obsidyen', color: '#000000' },
  { id: 'crimson', name: 'Kızıl Ay', color: '#2d0a0a' },
  { id: 'emerald', name: 'Zümrüt', color: '#064e3b' },
  { id: 'ocean', name: 'Okyanus', color: '#164e63' },
  { id: 'royal', name: 'Kraliyet', color: '#4c1d95' },
  { id: 'sunset', name: 'Gün Batımı', color: '#78350f' },
  { id: 'coffee', name: 'Kahve', color: '#44403c' },
  { id: 'matrix', name: 'Matris', color: '#0a1f0a' },
  { id: 'cyberpunk', name: 'Neon Şehir', color: '#2d1b4e' },
  { id: 'paper', name: 'Beyaz Sayfa', color: '#ffffff', border: true },
  { id: 'sepia', name: 'Klasik Daktilo', color: '#eee8d5' },
  { id: 'frost', name: 'Buzul', color: '#e0f2fe' },
  { id: 'rose', name: 'Gül Kurusu', color: '#4c1d28' },
  { id: 'gold', name: 'Altın Vadi', color: '#27272a' }
];

export default function ThemeSelector() {
  const { activeTheme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full bg-panel hover:bg-hover text-main border border-border px-4 py-3 rounded-xl flex items-center justify-between font-semibold transition-all shadow-md"
      >
        <div className="flex items-center gap-2"><Palette size={18} className="text-accent" /> Tema Seç</div>
        <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: THEMES.find(t=>t.id===activeTheme)?.color }}></div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-panel border border-border rounded-2xl shadow-2xl z-50 p-3 grid grid-cols-5 gap-2 animate-in fade-in zoom-in-95">
            <div className="col-span-5 text-xs text-muted font-bold uppercase tracking-widest mb-2 pb-2 border-b border-border">Auteur Temaları</div>
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => { setTheme(theme.id); setIsOpen(false); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${theme.border ? 'border border-gray-300' : ''}`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              >
                {activeTheme === theme.id && <Check size={16} color={['paper', 'sepia', 'frost'].includes(theme.id) ? '#000' : '#fff'} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}