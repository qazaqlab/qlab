import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import MakerWorldCatalog from './components/MakerWorldCatalog';
import CustomPrintInDrive from './components/CustomPrintInDrive';
import PartnerWorkspace from './components/PartnerWorkspace';
import MobileBottomNav from './components/MobileBottomNav';
import CitySelectorModal from './components/CitySelectorModal';
import { INITIAL_CUSTOM_ORDERS } from './data/initialOrders';
import { findNearestHub } from './data/cities';
import { MapPin, Phone, Camera, Mail, ArrowLeftRight, User } from 'lucide-react';

export default function App() {
  // Check if user has already selected a role
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('qlab_onboarded') === 'true';
  });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qlab_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Нурасыл Шарипов',
          phone: '+7 707 789 0369',
          city: 'Талдыкорган',
          role: 'client', // 'client' | 'partner'
          partnerProfile: {
            name: 'QLab Hub Талдыкорган',
            specialty: 'Скоростная 3D-печать Bambu Lab & CAD',
            city: 'Талдыкорган',
          },
        };
  });

  const [activeRole, setActiveRole] = useState(() => user.role || 'client');
  const [activeClientTab, setActiveClientTab] = useState('catalog'); // 'catalog' | 'custom'

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('qlab_orders');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_ORDERS;
  });

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('qlab_user', JSON.stringify({ ...user, role: activeRole }));
  }, [user, activeRole]);

  useEffect(() => {
    localStorage.setItem('qlab_orders', JSON.stringify(orders));
  }, [orders]);

  const hubInfo = findNearestHub(user.city);

  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveClientTab('custom');
  };

  const handleSaveUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Handler from Welcome Screen
  const handleSelectRoleFromWelcome = ({ role, city, partnerProfile }) => {
    setActiveRole(role);
    setUser((prev) => ({
      ...prev,
      city: city || prev.city,
      role,
      partnerProfile: partnerProfile || prev.partnerProfile,
    }));
    setHasCompletedOnboarding(true);
    setIsWelcomeModalOpen(false);
    localStorage.setItem('qlab_onboarded', 'true');
  };

  // Switch role directly from Navbar or Mobile menu
  const handleToggleRole = () => {
    const nextRole = activeRole === 'client' ? 'partner' : 'client';
    setActiveRole(nextRole);
    setUser((prev) => ({ ...prev, role: nextRole }));
  };

  // If user has not completed onboarding, show Welcome Screen as main screen
  if (!hasCompletedOnboarding) {
    return (
      <WelcomeScreen
        defaultCity={user.city || 'Талдыкорган'}
        onSelectRole={handleSelectRoleFromWelcome}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090e] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeClientTab}
        setActiveTab={setActiveClientTab}
        user={user}
        userCity={user.city}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        activeRole={activeRole}
        onSwitchRole={handleToggleRole}
        onOpenWelcome={() => setIsWelcomeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 pb-24 md:pb-8">
        
        {/* ================= BRANCH 1: CLIENT (ЗАКАЗЧИК) ================= */}
        {activeRole === 'client' && (
          <div className="space-y-6">
            
            {/* Dynamic Fallback Notice if current city has 0 local makers */}
            {!hubInfo.isLocal && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12121a] border border-slate-800 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      Маршрутизация для города {user.city}
                    </span>
                    <span className="text-slate-400 text-xs">
                      В городе {user.city} печать выполняется через ближайший региональный хаб: 
                      <strong className="text-white ml-1">{hubInfo.hub.name} ({hubInfo.distanceKm} км)</strong>. 
                      Срок экспресс-доставки: ~{hubInfo.deliveryTimeHours} ч.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors shrink-0"
                >
                  Сменить город
                </button>
              </div>
            )}

            {/* Client Tab 1: Catalog */}
            {activeClientTab === 'catalog' && (
              <MakerWorldCatalog
                userCity={user.city}
                onOrderPlaced={handleOrderPlaced}
              />
            )}

            {/* Client Tab 2: Custom Print Reverse Marketplace */}
            {activeClientTab === 'custom' && (
              <CustomPrintInDrive
                user={user}
                userCity={user.city}
                orders={orders}
                onUpdateOrders={setOrders}
                activeRole="client"
              />
            )}

          </div>
        )}

        {/* ================= BRANCH 2: PARTNER (3D-ПЕЧАТНИК / МАСТЕР) ================= */}
        {activeRole === 'partner' && (
          <PartnerWorkspace
            partnerUser={user.partnerProfile || { name: user.name, specialty: '3D-печать & CAD' }}
            partnerCity={user.city}
            clientOrders={orders}
            onUpdateOrders={setOrders}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation (Responsive web-app feel on smartphones) */}
      <MobileBottomNav
        activeRole={activeRole}
        activeTab={activeRole === 'client' ? activeClientTab : 'bids'}
        setActiveTab={(tab) => {
          if (activeRole === 'client') {
            setActiveClientTab(tab);
          }
        }}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenRoleModal={() => setIsWelcomeModalOpen(true)}
        userCity={user.city}
        ordersCount={orders.length}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#09090e] py-8 text-xs text-slate-400 select-none">
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
                <span className="text-[10px] text-slate-500 font-mono">
                  {activeRole === 'partner' ? '• Панель партнера' : '• Режим заказчика'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Цифровая фабрика 3D-печати и распределенная сеть мастеров
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWelcomeModalOpen(true)}
                className="text-orange-400 hover:underline flex items-center gap-1"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Сменить роль / экран приветствия</span>
              </button>
              <span>•</span>
              <span>Основатель: Шарипов Нурасыл</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal: City Selector */}
      {isCityModalOpen && (
        <CitySelectorModal
          currentUser={user}
          currentCity={user.city}
          onSave={handleSaveUser}
          onClose={() => setIsCityModalOpen(false)}
        />
      )}

      {/* Modal: Welcome Screen / Role Changer */}
      {isWelcomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-2 sm:p-4">
          <div className="relative max-w-4xl mx-auto my-6">
            <button
              onClick={() => setIsWelcomeModalOpen(false)}
              className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
            >
              Закрыть ✕
            </button>
            <WelcomeScreen
              defaultCity={user.city}
              onSelectRole={handleSelectRoleFromWelcome}
            />
          </div>
        </div>
      )}

    </div>
  );
}
