import { useState, useEffect } from 'react';
import { HardDrive } from 'lucide-react';

export default function StorageIndicator() {
  const [storageInfo, setStorageInfo] = useState({ usage: 0, quota: 0 });

  useEffect(() => {
    const checkStorage = async () => {
      // Tarayıcı bu özelliği destekliyor mu kontrol et
      if (navigator.storage && navigator.storage.estimate) {
        const { usage, quota } = await navigator.storage.estimate();
        setStorageInfo({ usage, quota });
      }
    };

    checkStorage(); // İlk açılışta hemen kontrol et
    const interval = setInterval(checkStorage, 15000); // 15 saniyede bir güncelle

    return () => clearInterval(interval);
  }, []);

  // Bayt (Byte) değerini MB veya GB'a çeviren matematiksel fonksiyon
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (storageInfo.quota === 0) return null; // Veri okunamadıysa gizle

  // Yüzdelik dilimi hesapla (Barın ne kadar dolacağını belirler)
  const usagePerc = Math.min((storageInfo.usage / storageInfo.quota) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-1">
        <div className="flex items-center gap-1.5 font-semibold">
          <HardDrive size={14} className="text-emerald-500" />
          <span>Yerel Depolama</span>
        </div>
        <span className="font-mono">
          {formatBytes(storageInfo.usage)} / {formatBytes(storageInfo.quota)}
        </span>
      </div>
      
      {/* İlerleme Barı (Progress Bar) */}
      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${usagePerc > 0 && usagePerc < 1 ? 1 : usagePerc}%` }} // Çok az bile kullanılsa 1% dolsun ki belli olsun
        />
      </div>
    </div>
  );
}