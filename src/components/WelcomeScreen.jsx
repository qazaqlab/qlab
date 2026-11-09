import React, { useState } from 'react';
import { 
  ShoppingBag, Wrench, MapPin, ArrowRight, ShieldCheck, 
  Clock, Sparkles, CheckCircle2, ChevronRight, User, Cpu, Calculator
} from 'lucide-react';
import { KAZAKHSTAN_CITIES } from '../data/cities';

export default function WelcomeScreen({ onSelectRole, defaultCity = 'Талдыкорган' }) {
  const [selectedRole, setSelectedRole] = useState('client'); // 'client' | 'partner'
  const [cityName, setCityName] = useState(defaultCity);
  const [partnerName, setPartnerName] = useState('Мастерская 3D-печати');
  const [partnerSpecialty, setPartnerSpecialty] = useState('Печать FDM + 3D-моделирование');

  const handleConfirm = () => {
    onSelectRole({
      role: selectedRole,
      city: cityName,
      partnerProfile: selectedRole === 'partner' ? {
        name: partnerName,
        specialty: partnerSpecialty,
        city: cityName,
      } : null,
    });
  };

  return (
    <div className="min-h-screen bg-[#09090e] text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      
      {/* Top Brand Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-orange-500/20">
            Q
          </div>
          <div>
            <div className="font-heading font-bold text-lg text-white leading-tight">
              QLab Studio
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Цифровая фабрика Казахстана
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#14141e] border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>Казахстан • 24 часа</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto my-auto space-y-8">
        
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Быстрая 3D-печать и моделирование в твоем городе
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
            Добро пожаловать в <span className="text-orange-500">QLab</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Изготовление пластиковых деталей, автокомпонентов и сувениров за 24 часа прямо в вашем городе вместо долгой доставки из Китая. Выберите, как вы хотите использовать платформу:
          </p>
        </div>

        {/* Role Cards Grid (Inspired by Barğoi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Option 1: Пользователь / Заказчик */}
          <div
            onClick={() => setSelectedRole('client')}
            className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border relative flex flex-col justify-between ${
              selectedRole === 'client'
                ? 'bg-[#141422] border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500'
                : 'bg-[#101018] border-slate-800/80 hover:border-slate-700 hover:bg-[#13131c]'
            }`}
          >
            {selectedRole === 'client' && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <ShoppingBag className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  Я Заказчик (Пользователь)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Хочу заказать деталь, модельку или запустить моделирование с печатью по своей цене.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Витрина готовых моделей (Bambu Lab, MakerWorld)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Биржа кастомной печати — своя цена (InDrive)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Изготовление в вашем городе за 24 часа</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/60">
              <span className={`text-xs font-semibold flex items-center justify-between ${
                selectedRole === 'client' ? 'text-orange-400' : 'text-slate-400'
              }`}>
                <span>Выбрать режим Заказчика</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Option 2: Партнер / 3D-Печатник / CAD */}
          <div
            onClick={() => setSelectedRole('partner')}
            className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border relative flex flex-col justify-between ${
              selectedRole === 'partner'
                ? 'bg-[#121620] border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500'
                : 'bg-[#101018] border-slate-800/80 hover:border-slate-700 hover:bg-[#13131c]'
            }`}
          >
            {selectedRole === 'partner' && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  Я Партнер (3D-Печатник / CAD)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  У меня есть 3D-принтер или я моделирую. Хочу брать заказы и управлять своей фермой.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Биржа клиентских заявок и торги за заказы</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Калькулятор себестоимости и учет прибыли (CRM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Склад катушек пластика и производственный календарь</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/60">
              <span className={`text-xs font-semibold flex items-center justify-between ${
                selectedRole === 'partner' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                <span>Выбрать режим Партнера</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

        </div>

        {/* Context Settings Box */}
        <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-4 sm:p-5 max-w-xl mx-auto space-y-4">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>Ваш город проживания / расположения мастерской:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Город</label>
              <select
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full bg-[#181824] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {KAZAKHSTAN_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.hasHub ? '• Хаб QLab' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedRole === 'partner' ? (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Название фермы / студии</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="3D Lab Almaty"
                  className="w-full bg-[#181824] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <span className="text-[11px] text-slate-400">Локальная доступность:</span>
                <span className="text-xs text-emerald-400 font-medium">
                  {KAZAKHSTAN_CITIES.find(c => c.name === cityName)?.hasHub 
                    ? 'Активная цифровая ферма в городе' 
                    : 'Маршрутизация в ближайший хаб'}
                </span>
              </div>
            )}
          </div>

          {/* Action Continue Button */}
          <button
            onClick={handleConfirm}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 shadow-xl ${
              selectedRole === 'client'
                ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
            }`}
          >
            <span>
              {selectedRole === 'client'
                ? `Войти как Заказчик в г. ${cityName}`
                : `Войти в рабочую панель Партнера`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Footer minimal info */}
      <div className="max-w-4xl w-full mx-auto pt-6 text-center text-[11px] text-slate-500 border-t border-slate-800/60">
        QLab Studio • Сеть цифровых фабрик Казахстана • Вы всегда сможете сменить роль в верхнем меню
      </div>

    </div>
  );
}
