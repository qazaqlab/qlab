import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, Search, Download, ThumbsUp, Check, 
  ArrowUp, Sparkles, Filter 
} from 'lucide-react';
import { CATALOG_MODELS } from '../data/catalog';
import ModelDetailModal from './ModelDetailModal';

export default function MakerWorldCatalog({ userCity, onOrderPlaced }) {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedTag, setSelectedTag] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'new' | 'trending'
  const [activeModel, setActiveModel] = useState(null);

  // Exact categories from the user screenshot
  const categories = [
    { id: 'Все', label: 'Все' },
    { id: '3D-принтер', label: '3D-принтер' },
    { id: 'Искусство', label: 'Искусство' },
    { id: 'Образование', label: 'Образование' },
    { id: 'Мода', label: 'Мода' },
    { id: 'Хобби и DIY', label: 'Хобби и DIY' },
    { id: 'Для дома', label: 'Для дома' },
    { id: 'Миниатюры', label: 'Миниатюры' },
    { id: 'Реквизит и косплей', label: 'Реквизит и косплей' },
    { id: 'Инструменты', label: 'Инструменты' },
    { id: 'Игрушки и игры', label: 'Игрушки и игры' },
    { id: 'Генеративная 3D-модель', label: 'Генеративная 3D-модель' },
  ];

  const tags = ['Рекомендуемое', 'Быстрая печать', 'Без поддержек', 'Print in Place'];

  const filteredModels = useMemo(() => {
    return CATALOG_MODELS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Все' ||
        item.category === selectedCategory ||
        item.tags.includes(selectedCategory);

      const matchesTag =
        selectedTag === 'Все' ||
        item.tags.includes(selectedTag);

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesTag && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.printsCompleted - a.printsCompleted;
      if (sortBy === 'new') return a.specs.printTimeMinutes - b.specs.printTimeMinutes;
      return b.rating - a.rating;
    });
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 relative">
      
      {/* 1. LEFT SIDEBAR: Exact replica of the screenshot ("Категории") */}
      <aside className="w-full lg:w-60 shrink-0 bg-[#1e1e1e] border border-[#2b2b2b] rounded-2xl p-4 space-y-6 select-none">
        
        {/* Section: Категории */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2.5 px-2">
            Категории
          </h3>
          <nav className="space-y-0.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#00ae42] bg-[#282828] font-bold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#262626]'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  {cat.id !== 'Все' && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#52525b] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section: Тег модели */}
        <div className="pt-2 border-t border-[#2b2b2b]">
          <h3 className="text-xs font-bold text-white mb-2.5 px-2">
            Тег модели
          </h3>
          <div className="flex flex-wrap gap-1.5 px-1">
            <button
              onClick={() => setSelectedTag('Все')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedTag === 'Все'
                  ? 'bg-[#00ae42] text-white'
                  : 'bg-[#282828] text-slate-400 hover:text-white'
              }`}
            >
              Все
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(selectedTag === t ? 'Все' : t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedTag === t
                    ? 'bg-[#00ae42] text-white'
                    : 'bg-[#282828] text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA: Grid of models */}
      <main className="flex-1 w-full space-y-4">
        
        {/* Top Controls: Search and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1e1e1e] p-2.5 rounded-2xl border border-[#2b2b2b]">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск 3D моделей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-[#2b2b2b] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00ae42]"
            />
          </div>

          {/* Sort tabs */}
          <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#2b2b2b] text-xs">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                sortBy === 'popular' ? 'bg-[#282828] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Популярные
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                sortBy === 'new' ? 'bg-[#282828] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Новые
            </button>
          </div>

        </div>

        {/* Models Grid: 3 columns matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              onClick={() => setActiveModel(model)}
              className="group bg-[#1e1e1e] border border-[#2b2b2b] hover:border-[#3f3f46] rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200"
            >
              {/* Model Image with green MakerWorld badge in top-left */}
              <div className="relative aspect-[4/3] bg-[#121212] overflow-hidden">
                <img
                  src={model.images[0]}
                  alt={model.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* MakerWorld green cube badge (as in screenshot) */}
                <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-md bg-[#589c36] flex items-center justify-center shadow-md">
                  <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                    <span className="bg-white rounded-[1px]" />
                    <span className="bg-white/80 rounded-[1px]" />
                    <span className="bg-white/80 rounded-[1px]" />
                    <span className="bg-white rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                
                {/* Title */}
                <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                  {model.title}
                </h4>

                {/* Author and Stats Row (Exact replica of MakerWorld card footer) */}
                <div className="flex items-center justify-between text-xs text-[#a1a1aa] pt-1">
                  
                  {/* Left: Avatar + Name + Verified Badge */}
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <img
                      src={model.author.avatar}
                      alt={model.author.name}
                      className="w-4 h-4 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate text-xs text-[#d4d4d8] font-normal">
                      {model.author.name}
                    </span>
                    {model.author.verified && (
                      <span className="w-3 h-3 rounded-full bg-[#00ae42] flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-white stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Right: Download Count & Likes Count */}
                  <div className="flex items-center gap-2.5 shrink-0 text-[11px] text-[#a1a1aa]">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {model.downloadsCount || `${Math.round(model.printsCompleted / 100) / 10} k`}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {model.likesCount || model.reviewsCount * 12}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>

      </main>

      {/* Floating TOP button: exact replica of the circular TOP button on the screenshot */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-30 w-11 h-11 rounded-full bg-[#27272a]/90 hover:bg-[#3f3f46] text-white border border-[#3f3f46] shadow-xl flex flex-col items-center justify-center text-[9px] font-bold transition-all hover:scale-105"
      >
        <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>TOP</span>
      </button>

      {/* Detail Modal */}
      {activeModel && (
        <ModelDetailModal
          model={activeModel}
          userCity={userCity}
          onClose={() => setActiveModel(null)}
          onOrderPlaced={(order) => {
            onOrderPlaced && onOrderPlaced(order);
          }}
        />
      )}

    </div>
  );
}
