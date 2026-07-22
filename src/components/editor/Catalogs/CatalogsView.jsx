import { Plus, Trash2, StickyNote, Link, Image as ImageIcon } from 'lucide-react';

export default function CatalogsView({ catalogs, addCatalogItem, updateCatalogItem, deleteCatalogItem }) {
  
  // Tipe göre ikon belirleme
  const getIcon = (type) => {
    if(type === 'Link') return <Link size={24} className="text-blue-400" />;
    if(type === 'Resim') return <ImageIcon size={24} className="text-purple-400" />;
    return <StickyNote size={24} className="text-yellow-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Araştırma Katalogları</h2>
        <button
          onClick={addCatalogItem}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-semibold transition-colors"
        >
          <Plus size={20} />
          Yeni Materyal Ekle
        </button>
      </div>

      {/* Masonry benzeri ızgara yapısı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {catalogs.map((item) => (
          <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-4 group relative hover:border-yellow-500/50 transition-colors">
            
            <button
              onClick={() => deleteCatalogItem(item.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={20} />
            </button>

            <div className="flex items-center gap-3">
              {getIcon(item.type)}
              <select
                value={item.type}
                onChange={(e) => updateCatalogItem(item.id, 'type', e.target.value)}
                className="bg-gray-900 text-gray-300 text-sm rounded border border-gray-700 p-1 outline-none"
              >
                <option value="Not">Not</option>
                <option value="Link">Bağlantı</option>
                <option value="Resim">Resim (URL)</option>
              </select>
            </div>

            <input
              type="text"
              value={item.title}
              onChange={(e) => updateCatalogItem(item.id, 'title', e.target.value)}
              className="w-full bg-transparent text-xl font-bold text-white outline-none border-b border-transparent focus:border-yellow-500 placeholder-gray-500"
              placeholder="Materyal Başlığı"
            />

            {item.type === 'Resim' ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={item.content}
                  onChange={(e) => updateCatalogItem(item.id, 'content', e.target.value)}
                  placeholder="Resim URL'sini buraya yapıştır..."
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-sm outline-none focus:border-yellow-500"
                />
                {item.content && <img src={item.content} alt={item.title} className="w-full h-auto rounded-lg object-cover mt-2 border border-gray-700" />}
              </div>
            ) : item.type === 'Link' ? (
              <input 
                type="url" 
                value={item.content}
                onChange={(e) => updateCatalogItem(item.id, 'content', e.target.value)}
                placeholder="https://..."
                className="bg-gray-900 border border-gray-700 rounded p-2 text-sm outline-none focus:border-yellow-500 text-blue-400 underline"
              />
            ) : (
              <textarea
                value={item.content}
                onChange={(e) => updateCatalogItem(item.id, 'content', e.target.value)}
                className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 resize-none"
                placeholder="Araştırma notların, tarihsel detaylar vs..."
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}