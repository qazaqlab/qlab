import React from 'react';
import { 
  ShoppingBag, Sparkles, MapPin, ChevronDown, User, 
  Cpu, ArrowLeftRight, Wrench
} from 'lucide-react';
import { findNearestHub } from '../data/cities';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  userCity,
  onOpenCityModal,
  activeRole,
  onSwitchRole,
  onOpenWelcome,
}) {
  const hubInfo = findNearestHub(userCity);

  return (
    <header className="sticky top-0 z-40 bg-[#09090e]/90 backdrop-blur-md border-b border-slate-800 transition-all select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            onClick={onOpenWelcome}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Перейти на экран приветствия"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform">
              Q
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-base sm:text-lg text-white">
                  QLab<span className="text-orange-500">.</span>Studio
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeRole === 'partner'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                }`}>
                  {activeRole === 'partner' ? 'Партнер' : 'Заказчик'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block">
                Цифровая фабрика в твоем городе
              </p>
            </div>
          </div>
        </div>

        {/* Center: Tabs for Client Mode on Desktop/Laptop */}
        {activeRole === 'client' && (
          <nav className="hidden md:flex items-center bg-[#12121a] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
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
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'custom'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Кастомная печать</span>
            </button>
          </nav>
        )}

        {/* Center: Hint for Partner Mode on Desktop/Laptop */}
        {activeRole === 'partner' && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-[#12121a] px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Кабинет 3D-мастера • Управление заказами и тарифами</span>
          </div>
        )}

        {/* Right Section: City & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* City Switcher */}
          <button
            onClick={onOpenCityModal}
            title="Сменить город"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 bg-[#12121a] text-xs flex items-center gap-1.5 sm:gap-2 hover:border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-medium text-slate-200 text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-none">
              {userCity}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {/* Quick Role Switcher (Desktop & Mobile) */}
          <button
            onClick={onSwitchRole}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              activeRole === 'client'
                ? 'bg-[#141420] text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                : 'bg-[#141420] text-orange-400 border-orange-500/30 hover:bg-orange-500/10'
            }`}
            title="Переключить роль между клиентом и партнером"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {activeRole === 'client' ? 'В кабинет Партнера' : 'В режим Заказчика'}
            </span>
            <span className="sm:hidden text-[10px]">
              {activeRole === 'client' ? 'Партнер' : 'Клиент'}
            </span>
          </button>

          {/* Profile / Settings Button */}
          <button
            onClick={onOpenWelcome}
            title="Выбор роли и города"
            className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs hover:border-orange-500 transition-colors"
          >
            {user.name ? user.name[0].toUpperCase() : 'Q'}
          </button>

        </div>

      </div>
    </header>
  );
}
