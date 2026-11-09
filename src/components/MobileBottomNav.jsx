import React from 'react';
import { 
  ShoppingBag, Wrench, MapPin, User, Calculator, 
  Layers, ListCheck, TrendingUp, DollarSign 
} from 'lucide-react';

export default function MobileBottomNav({ 
  activeRole, 
  activeTab, 
  setActiveTab, 
  onOpenCityModal, 
  onOpenRoleModal,
  userCity,
  ordersCount = 0 
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0e16]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex justify-around items-center select-none shadow-2xl pb-safe">
      
      {activeRole === 'client' ? (
        <>
          {/* Client Tab 1: Catalog */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
              activeTab === 'catalog'
                ? 'text-orange-500 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'catalog' ? 'bg-orange-500/10' : ''}`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>Каталог</span>
          </button>

          {/* Client Tab 2: Custom Print */}
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all relative ${
              activeTab === 'custom'
                ? 'text-orange-500 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'custom' ? 'bg-orange-500/10' : ''}`}>
              <Wrench className="w-5 h-5" />
            </div>
            <span>Кастомная</span>
            {ordersCount > 0 && (
              <span className="absolute top-0 right-1 px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-orange-500 text-white">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Client Tab 3: City */}
          <button
            onClick={onOpenCityModal}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-all"
          >
            <div className="p-1 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-400" />
            </div>
            <span className="truncate max-w-[65px]">{userCity}</span>
          </button>

          {/* Client Tab 4: Switch Role */}
          <button
            onClick={onOpenRoleModal}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-all"
          >
            <div className="p-1 rounded-lg">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <span>Партнерам</span>
          </button>
        </>
      ) : (
        <>
          {/* Partner Tab 1: Orders exchange */}
          <button
            onClick={() => setActiveTab('bids')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
              activeTab === 'bids'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'bids' ? 'bg-emerald-500/10' : ''}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <span>Биржа</span>
          </button>

          {/* Partner Tab 2: Calculator */}
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
              activeTab === 'calc'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'calc' ? 'bg-emerald-500/10' : ''}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <span>Расчет</span>
          </button>

          {/* Partner Tab 3: Spools */}
          <button
            onClick={() => setActiveTab('filaments')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
              activeTab === 'filaments'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'filaments' ? 'bg-emerald-500/10' : ''}`}>
              <Layers className="w-5 h-5" />
            </div>
            <span>Склад</span>
          </button>

          {/* Partner Tab 4: CRM Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
              activeTab === 'orders'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'orders' ? 'bg-emerald-500/10' : ''}`}>
              <ListCheck className="w-5 h-5" />
            </div>
            <span>CRM База</span>
          </button>

          {/* Partner Tab 5: Role Switch */}
          <button
            onClick={onOpenRoleModal}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-all"
          >
            <div className="p-1 rounded-lg">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <span>Клиентам</span>
          </button>
        </>
      )}

    </nav>
  );
}
