import React from 'react';
import { 
  ShoppingBag, Sparkles, MapPin, ChevronDown 
} from 'lucide-react';
import { findNearestHub } from '../data/cities';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  userCity,
  onOpenCityModal,
  activeRole,
  setActiveRole,
}) {
  const hubInfo = findNearestHub(userCity);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-lg shadow-sm">
              Q
            </div>
            <div>
              <span className="font-heading font-black text-lg text-white">
                QLab<span className="text-orange-500">.</span>Studio
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Цифровая фабрика в твоем городе
              </p>
            </div>
          </div>
        </div>

        {/* The Two Main Tabs (Clean, no extra labels) */}
        <nav className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Каталог моделей</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Кастомная печать</span>
          </button>
        </nav>

        {/* Right Section: City & Role */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* City Switcher: Clean, just city name */}
          <button
            onClick={onOpenCityModal}
            title="Сменить город"
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs flex items-center gap-2 hover:border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-medium text-slate-200">{userCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveRole('client')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeRole === 'client'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Заказчик
            </button>
            <button
              onClick={() => setActiveRole('maker')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeRole === 'maker'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Мастер
            </button>
          </div>

          {/* Profile chip */}
          <button
            onClick={onOpenCityModal}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-medium text-xs hover:border-orange-500"
          >
            {user.name ? user.name[0].toUpperCase() : 'Н'}
          </button>

        </div>

      </div>
    </header>
  );
}
