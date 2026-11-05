import React, { useState } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { KAZAKHSTAN_CITIES, findNearestHub } from '../data/cities';

export default function CitySelectorModal({
  currentUser,
  currentCity,
  onSave,
  onClose,
}) {
  const [name, setName] = useState(currentUser.name || 'Нурасыл');
  const [phone, setPhone] = useState(currentUser.phone || '+7 707 789 0369');
  const [selectedCity, setSelectedCity] = useState(currentCity || 'Талдыкорган');

  const hubInfo = findNearestHub(selectedCity);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      phone,
      city: selectedCity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <h3 className="text-base font-bold text-white">
              Город проживания и профиль
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Ваше имя
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Номер телефона
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 707 789 0369"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          {/* City Selection: Just clean city names as requested! */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Город
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            >
              {KAZAKHSTAN_CITIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clean status note */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            {hubInfo.isLocal ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>В городе {selectedCity} действует локальная ферма печати (готовность от {hubInfo.deliveryTimeHours} ч).</span>
              </div>
            ) : (
              <div className="text-slate-400">
                Ближайший хаб: <strong className="text-slate-200">{hubInfo.hub.name}</strong> ({hubInfo.distanceKm} км). Срок доставки: {hubInfo.deliveryTimeHours} ч.
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors"
            >
              Сохранить
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
