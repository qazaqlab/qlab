import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, Clock, Weight, MapPin, 
  Layers, Info, ShoppingBag, ArrowRight, Zap, Award 
} from 'lucide-react';
import { PRINT_MATERIALS, calculatePrintPrice } from '../data/materials';
import { findNearestHub } from '../data/cities';

const resolveImgUrl = (src) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const base = import.meta.env.BASE_URL || './';
  const cleanSrc = src.replace(/^\.?\//, '');
  return `${base}${cleanSrc}`;
};

export default function ModelDetailModal({ model, userCity, onClose, onOrderPlaced }) {
  const [selectedMaterial, setSelectedMaterial] = useState(model.specs.recommendedFilament || 'pla-silk');
  const [selectedColor, setSelectedColor] = useState(model.specs.defaultColor);
  const [infill, setInfill] = useState(model.specs.infillPercent || 20);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  if (!model) return null;

  const currentMaterial = PRINT_MATERIALS.find((m) => m.id === selectedMaterial) || PRINT_MATERIALS[0];
  const hubInfo = findNearestHub(userCity);

  const pricing = calculatePrintPrice({
    weightGrams: model.specs.weightGrams,
    printTimeMinutes: model.specs.printTimeMinutes,
    materialId: selectedMaterial,
    infillPercent: infill,
    quantity: quantity,
  });

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderDone(true);

      const newOrder = {
        id: `ord-cat-${Date.now().toString().slice(-4)}`,
        title: `Печать детали: ${model.title}`,
        serviceType: 'print_only',
        serviceLabel: '3D-Печать из каталога',
        category: model.category,
        status: 'in_progress',
        statusLabel: 'В очереди на печать',
        city: userCity,
        client: {
          name: 'Вы (Текущий заказчик)',
          phone: '+7 707 789 0369',
        },
        clientOfferedBudget: pricing.totalPrice,
        description: `Заказ из каталога моделей. Материал: ${currentMaterial.name}, Цвет: ${selectedColor}, Заполнение: ${infill}%, Тираж: ${quantity} шт.`,
        dimensions: { x: 120, y: 80, z: 100 },
        urgency: hubInfo.isLocal ? '4-6 часов' : `Хаб ${hubInfo.hub.name} (24ч)`,
        urgencyBadge: hubInfo.isLocal ? 'Локально' : 'Доставка',
        attachments: [{ name: `${model.geometryType}_model.stl`, size: '8.4 MB', type: '3d' }],
        bids: [
          {
            id: `bid-auto-${Date.now()}`,
            makerName: hubInfo.isLocal ? `Ферма ${userCity}` : `Хаб ${hubInfo.hub.name}`,
            specialization: 'Станция скоростной 3D-печати',
            equipment: 'Bambu Lab P1S Combo',
            rating: 5.0,
            city: hubInfo.hub.name,
            offeredPrice: pricing.totalPrice,
            proposedTime: hubInfo.isLocal ? 'Готовность через 4 часа' : 'Доставка за 24 часа',
            comment: `Заказ распределен на станцию печати (${hubInfo.hub.name}).`,
            status: 'accepted',
          },
        ],
        chatMessages: [
          {
            id: 'init-msg',
            sender: 'maker',
            makerName: `Ферма ${hubInfo.hub.name}`,
            text: `Здравствуйте. Заказ принят в производство на станции (${hubInfo.hub.name}). Используем полимер ${currentMaterial.name}.`,
            time: 'Только что',
          },
        ],
      };

      onOrderPlaced && onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {model.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Лицензия: Коммерческое использование разрешено
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Product Photo & Details */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* High-Resolution Photo Display */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#121212] aspect-[4/3] sm:h-[360px] flex items-center justify-center">
              <img
                src={resolveImgUrl(model.images[0])}
                alt={model.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = '1';
                    const filename = model.images[0].split('/').pop();
                    e.target.src = `./models/${filename}`;
                  }
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-medium text-white border border-white/10 flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-[#00ae42]" />
                Фото готового изделия
              </div>
            </div>

            {/* Author info */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={model.author.avatar}
                  alt={model.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <span className="font-medium text-slate-200 block">{model.author.name}</span>
                  <span className="text-[11px] text-slate-500">{model.author.handle}</span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span className="text-emerald-400 font-medium">{model.license.type}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-300">Описание изделия</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {model.description}
              </p>
            </div>

            {/* Fast specs */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <Weight className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
                <span className="text-slate-500 text-[10px] block">Вес</span>
                <span className="font-medium text-slate-200">{model.specs.weightGrams} г</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <Clock className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
                <span className="text-slate-500 text-[10px] block">Время</span>
                <span className="font-medium text-slate-200">~{Math.round(model.specs.printTimeMinutes / 60 * 10) / 10} ч</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <Zap className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
                <span className="text-slate-500 text-[10px] block">Скорость</span>
                <span className="font-medium text-slate-200">500 мм/с</span>
              </div>
            </div>

          </div>

          {/* Right Column: Print Configurator */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-heading">
                  {model.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Габариты: {model.specs.dimensions}</p>
              </div>

              {/* City & Farm Status Notice: Clean and simple */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300">
                <div className="flex items-center gap-2 mb-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="font-semibold text-slate-200">г. {userCity}</span>
                </div>
                <div className="text-[11px] text-slate-400">{hubInfo.message}</div>
              </div>

              {/* Material */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Материал
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRINT_MATERIALS.slice(0, 4).map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        selectedMaterial === mat.id
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-medium'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate font-medium">{mat.name.split('(')[0]}</div>
                      <div className="text-[10px] text-slate-500 truncate">{mat.strength}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Цвет
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentMaterial.colorExamples.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        selectedColor === col
                          ? 'bg-orange-500 text-white border-orange-500 font-medium'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infill & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Заполнение</span>
                    <span className="text-orange-400 font-mono">{infill}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={infill}
                    onChange={(e) => setInfill(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Количество
                  </label>
                  <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-sm text-slate-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Расчет стоимости:</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Вес×50₸ + Время×100₸ + 2000₸
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Итого:</span>
                  <div className="text-2xl font-bold text-orange-400 font-mono">
                    {pricing.totalPrice.toLocaleString()} ₸
                  </div>
                </div>
              </div>

            </div>

            {/* Order Button */}
            <div>
              {orderDone ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium text-xs mb-1">
                    <Check className="w-4 h-4" />
                    Заказ принят в производство
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors"
                  >
                    Перейти к заказам
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Заказать печать • {pricing.totalPrice.toLocaleString()} ₸</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
