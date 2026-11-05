import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MakerWorldCatalog from './components/MakerWorldCatalog';
import CustomPrintInDrive from './components/CustomPrintInDrive';
import CitySelectorModal from './components/CitySelectorModal';
import { INITIAL_CUSTOM_ORDERS } from './data/initialOrders';
import { findNearestHub } from './data/cities';
import { MapPin, Phone, Camera, Mail } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qlab_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Нурасыл Шарипов',
          phone: '+7 707 789 0369',
          city: 'Талдыкорган',
        };
  });

  const [activeTab, setActiveTab] = useState('catalog');
  const [activeRole, setActiveRole] = useState('client');
  
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('qlab_orders');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_ORDERS;
  });

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('qlab_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('qlab_orders', JSON.stringify(orders));
  }, [orders]);

  const hubInfo = findNearestHub(user.city);

  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTab('custom');
  };

  const handleSaveUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        userCity={user.city}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Dynamic Fallback Notice if current city has 0 local makers */}
        {!hubInfo.isLocal && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200 block">
                  Маршрутизация для города {user.city}
                </span>
                <span className="text-slate-400 text-xs">
                  В городе {user.city} печать выполняется через ближайший хаб: 
                  <strong className="text-white ml-1">{hubInfo.hub.name} ({hubInfo.distanceKm} км)</strong>. 
                  Срок доставки: {hubInfo.deliveryTimeHours} ч.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors shrink-0"
            >
              Сменить город
            </button>
          </div>
        )}

        {/* Tab 1: Catalog */}
        {activeTab === 'catalog' && (
          <MakerWorldCatalog
            userCity={user.city}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {/* Tab 2: Custom Print */}
        {activeTab === 'custom' && (
          <CustomPrintInDrive
            user={user}
            userCity={user.city}
            orders={orders}
            onUpdateOrders={setOrders}
            activeRole={activeRole}
          />
        )}

      </main>

      {/* Clean Footer (Removed the requested blocks and pitch deck) */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-xs">
                  Q
                </div>
                <span className="font-heading font-bold text-base text-white">
                  QLab Studio
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Цифровая фабрика 3D-печати и моделирования
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-slate-400 text-xs">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>+7 707 789 0369</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <span>@qlab.3d</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>qlab.3d.st@gmail.com</span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              © 2026 QLab Studio. Все права защищены.
            </div>
            <div>
              Основатель: Шарипов Нурасыл (Талдыкорган / Алматы)
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isCityModalOpen && (
        <CitySelectorModal
          currentUser={user}
          currentCity={user.city}
          onSave={handleSaveUser}
          onClose={() => setIsCityModalOpen(false)}
        />
      )}

    </div>
  );
}
