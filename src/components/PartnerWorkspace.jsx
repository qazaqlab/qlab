import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, Layers, ListCheck, TrendingUp, Calendar as CalendarIcon, 
  Settings, Plus, Search, Filter, Trash2, CheckCircle2, Clock, 
  MapPin, Phone, MessageSquare, DollarSign, Download, ArrowUpRight, 
  AlertTriangle, ChevronRight, Zap, RefreshCw, X, Check, Eye
} from 'lucide-react';
import { KAZAKHSTAN_CITIES } from '../data/cities';

export default function PartnerWorkspace({ 
  partnerUser, 
  partnerCity, 
  clientOrders = [], 
  onUpdateOrders,
  onOpenChatWithOrder 
}) {
  const [partnerTab, setPartnerTab] = useState('bids'); // 'bids' | 'calc' | 'filaments' | 'orders' | 'finance' | 'calendar'

  // Master Tariffs State (from qlab_calc.html)
  const [tariffs, setTariffs] = useState(() => {
    const saved = localStorage.getItem('qlab_partner_tariffs');
    return saved ? JSON.parse(saved) : {
      plasticKgPrice: 6000,
      powerKwhPrice: 30.15,
      depreciationPerHour: 120,
      printerWatts: 110,
      clientRateMatPerGram: 45,
      clientRateTimePerHour: 150,
    };
  });

  // Spools (Warehouse) State
  const [spools, setSpools] = useState(() => {
    const saved = localStorage.getItem('qlab_partner_spools');
    return saved ? JSON.parse(saved) : [
      {
        id: 'spool-1',
        brand: 'Bambu Lab PLA Basic',
        type: 'PLA',
        colorName: 'Черный матовый',
        colorHex: '#18181b',
        weight: 1000,
        remaining: 780,
        price: 6500,
      },
      {
        id: 'spool-2',
        brand: 'eSUN Silk PLA',
        type: 'PLA',
        colorName: 'Золото Казахстана',
        colorHex: '#d4af37',
        weight: 1000,
        remaining: 920,
        price: 7500,
      },
      {
        id: 'spool-3',
        brand: 'Bambu Lab PETG-CF',
        type: 'PETG',
        colorName: 'Карбон темный',
        colorHex: '#27272a',
        weight: 1000,
        remaining: 450,
        price: 11000,
      },
      {
        id: 'spool-4',
        brand: 'Kingroon TPU 95A',
        type: 'TPU',
        colorName: 'Сигнальный оранжевый',
        colorHex: '#f97316',
        weight: 1000,
        remaining: 600,
        price: 8500,
      },
    ];
  });

  // Internal Partner CRM Orders (from calculator & exchange)
  const [crmOrders, setCrmOrders] = useState(() => {
    const saved = localStorage.getItem('qlab_partner_crm_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'CRM-101',
        clientName: 'Данияр Сатпаев',
        clientPhone: '+7 777 412 8899',
        title: 'Косозубая шестерня редуктора (PA-CF)',
        spoolId: 'spool-3',
        spoolName: 'Bambu Lab PETG-CF (Карбон темный)',
        weightSingle: 85,
        totalWeight: 85,
        hoursSingle: 2,
        minutesSingle: 45,
        totalHours: 2.75,
        qty: 1,
        cadFee: 2500,
        costPrint: 1820,
        clientPrice: 6800,
        profit: 4980,
        margin: 73,
        status: 'printing', // 'queue' | 'printing' | 'ready' | 'completed'
        deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
      },
      {
        id: 'CRM-102',
        clientName: 'Айгерим Берикова',
        clientPhone: '+7 701 555 1234',
        title: 'Салфетница «Қошқар мүйіз» Gold',
        spoolId: 'spool-2',
        spoolName: 'eSUN Silk PLA (Золото Казахстана)',
        weightSingle: 140,
        totalWeight: 280,
        hoursSingle: 3,
        minutesSingle: 20,
        totalHours: 6.66,
        qty: 2,
        cadFee: 0,
        costPrint: 3450,
        clientPrice: 13600,
        profit: 10150,
        margin: 75,
        status: 'ready',
        deadline: new Date(Date.now() + 43200000).toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
      },
    ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('qlab_partner_tariffs', JSON.stringify(tariffs));
  }, [tariffs]);

  useEffect(() => {
    localStorage.setItem('qlab_partner_spools', JSON.stringify(spools));
  }, [spools]);

  useEffect(() => {
    localStorage.setItem('qlab_partner_crm_orders', JSON.stringify(crmOrders));
  }, [crmOrders]);

  // --- Calculator Form State (from qlab_calc.html) ---
  const [calcClientName, setCalcClientName] = useState('');
  const [calcClientPhone, setCalcClientPhone] = useState('');
  const [calcDeadline, setCalcDeadline] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [calcStatus, setCalcStatus] = useState('printing');
  const [calcTitle, setCalcTitle] = useState('Деталь на 3D-печать');
  const [calcSpoolId, setCalcSpoolId] = useState(spools[0]?.id || 'default');
  const [calcWeight, setCalcWeight] = useState(120);
  const [calcHours, setCalcHours] = useState(3);
  const [calcMinutes, setCalcMinutes] = useState(30);
  const [calcQty, setCalcQty] = useState(1);
  const [calcCadFee, setCalcCadFee] = useState(1500);
  const [toastMessage, setToastMessage] = useState(null);

  // Spool Modal State
  const [isAddSpoolOpen, setIsAddSpoolOpen] = useState(false);
  const [newSpoolBrand, setNewSpoolBrand] = useState('Bambu Lab PLA');
  const [newSpoolType, setNewSpoolType] = useState('PLA');
  const [newSpoolColor, setNewSpoolColor] = useState('Белый');
  const [newSpoolHex, setNewSpoolHex] = useState('#ffffff');
  const [newSpoolWeight, setNewSpoolWeight] = useState(1000);
  const [newSpoolPrice, setNewSpoolPrice] = useState(6500);

  // Tariff Settings Modal
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);

  // Exchange Bid Modal (Making a bid on client order)
  const [bidModalOrder, setBidModalOrder] = useState(null);
  const [bidPrice, setBidPrice] = useState(5000);
  const [bidHours, setBidHours] = useState('24 часа');
  const [bidEquipment, setBidEquipment] = useState('Bambu Lab P1S Combo');
  const [bidComment, setBidComment] = useState('Беру в печать. Качественный пластик, точность слоев 0.16 мм.');

  // CRM Orders Filter & Search
  const [crmStatusFilter, setCrmStatusFilter] = useState('all');
  const [crmSearch, setCrmSearch] = useState('');

  // Exchange Filter
  const [exchangeCityFilter, setExchangeCityFilter] = useState('all');

  // --- Real-time Calculations (Matching qlab_calc.html formula) ---
  const currentCalculation = useMemo(() => {
    const singleHours = Number(calcHours) + Number(calcMinutes) / 60;
    const totalWeight = Number(calcWeight) * Number(calcQty);
    const totalHours = singleHours * Number(calcQty);

    const selectedSpool = spools.find((s) => s.id === calcSpoolId);
    const plasticPriceKg = selectedSpool ? selectedSpool.price : tariffs.plasticKgPrice;

    // 1. Прямые физические затраты (себестоимость)
    const costPlastic = (totalWeight / 1000) * plasticPriceKg;
    const totalKwh = totalHours * (tariffs.printerWatts / 1000);
    const costPower = totalKwh * tariffs.powerKwhPrice;
    const costDeprec = totalHours * tariffs.depreciationPerHour;
    const costRisk = (costPlastic + costPower + costDeprec) * 0.1; // 10% брак

    const costPrintTotal = costPlastic + costPower + costDeprec + costRisk;

    // 2. Цена клиенту
    const clientMatPart = totalWeight * tariffs.clientRateMatPerGram;
    const clientTimePart = totalHours * tariffs.clientRateTimePerHour;
    const rawPrice = clientMatPart + clientTimePart + Number(calcCadFee);
    const clientPrice = Math.max(500, Math.round(rawPrice / 50) * 50);

    // 3. Прибыль и маржа
    const profit = clientPrice - costPrintTotal;
    const margin = clientPrice > 0 ? Math.round((profit / clientPrice) * 100) : 0;

    return {
      singleHours,
      totalWeight,
      totalHours,
      totalKwh,
      costPlastic,
      costPower,
      costDeprec,
      costRisk,
      costPrintTotal,
      clientPrice,
      profit,
      margin,
      selectedSpool,
      isSpoolLow: selectedSpool ? selectedSpool.remaining < totalWeight : false,
    };
  }, [calcWeight, calcHours, calcMinutes, calcQty, calcCadFee, calcSpoolId, spools, tariffs]);

  // Handler: Save calculated order to CRM and deduct spool plastic
  const handleSaveOrderToCrm = () => {
    if (!calcTitle.trim()) {
      alert('Укажите наименование детали!');
      return;
    }

    const newOrder = {
      id: `CRM-${Date.now().toString().slice(-4)}`,
      clientName: calcClientName || 'Частный заказчик',
      clientPhone: calcClientPhone || '+7 707 000 0000',
      title: calcTitle,
      spoolId: calcSpoolId,
      spoolName: currentCalculation.selectedSpool 
        ? `${currentCalculation.selectedSpool.brand} (${currentCalculation.selectedSpool.colorName})`
        : 'Базовый тариф',
      weightSingle: Number(calcWeight),
      totalWeight: currentCalculation.totalWeight,
      hoursSingle: Number(calcHours),
      minutesSingle: Number(calcMinutes),
      totalHours: currentCalculation.totalHours,
      qty: Number(calcQty),
      cadFee: Number(calcCadFee),
      costPrint: Math.round(currentCalculation.costPrintTotal),
      clientPrice: currentCalculation.clientPrice,
      profit: Math.round(currentCalculation.profit),
      margin: currentCalculation.margin,
      status: calcStatus,
      deadline: calcDeadline,
      date: new Date().toISOString().split('T')[0],
    };

    // Deduct spool plastic if spool exists
    if (currentCalculation.selectedSpool) {
      setSpools((prev) =>
        prev.map((s) =>
          s.id === calcSpoolId
            ? { ...s, remaining: Math.max(0, s.remaining - currentCalculation.totalWeight) }
            : s
        )
      );
    }

    setCrmOrders((prev) => [newOrder, ...prev]);

    setToastMessage(`Заказ «${calcTitle}» успешно сохранен в базу CRM!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Reset some form inputs for next order
    setCalcTitle('Новая деталь');
    setCalcClientName('');
    setCalcClientPhone('');
  };

  // Handler: Add new spool
  const handleAddSpool = (e) => {
    e.preventDefault();
    const newSpool = {
      id: `spool-${Date.now()}`,
      brand: newSpoolBrand,
      type: newSpoolType,
      colorName: newSpoolColor,
      colorHex: newSpoolHex,
      weight: Number(newSpoolWeight),
      remaining: Number(newSpoolWeight),
      price: Number(newSpoolPrice),
    };
    setSpools((prev) => [newSpool, ...prev]);
    setIsAddSpoolOpen(false);
  };

  // Handler: Maker places a bid on Client Exchange order
  const handlePlaceBidOnClientOrder = () => {
    if (!bidModalOrder) return;

    const newBid = {
      id: `bid-${Date.now()}`,
      makerName: partnerUser.name || 'Мастерская QLab',
      specialization: partnerUser.specialty || 'Скоростная 3D-печать',
      equipment: bidEquipment,
      rating: 5.0,
      city: partnerCity,
      offeredPrice: Number(bidPrice),
      proposedTime: bidHours,
      comment: bidComment,
      status: 'pending',
    };

    const updated = clientOrders.map((ord) => {
      if (ord.id === bidModalOrder.id) {
        return {
          ...ord,
          bids: [newBid, ...(ord.bids || [])],
        };
      }
      return ord;
    });

    onUpdateOrders && onUpdateOrders(updated);
    setBidModalOrder(null);
    setToastMessage(`Ваша ставка ${Number(bidPrice).toLocaleString()} ₸ отправлена заказчику!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Financial KPIs
  const financialMetrics = useMemo(() => {
    const totalRev = crmOrders.reduce((sum, o) => sum + (o.status === 'completed' || o.status === 'ready' ? o.clientPrice : 0), 0);
    const totalCost = crmOrders.reduce((sum, o) => sum + (o.status === 'completed' || o.status === 'ready' ? o.costPrint : 0), 0);
    const totalProfit = totalRev - totalCost;
    const margin = totalRev > 0 ? Math.round((totalProfit / totalRev) * 100) : 0;
    const totalPlasticKg = crmOrders.reduce((sum, o) => sum + (o.totalWeight || 0), 0) / 1000;
    const avgCheck = crmOrders.length > 0 ? Math.round(totalRev / crmOrders.length) : 0;

    return { totalRev, totalProfit, margin, totalCost, totalPlasticKg, avgCheck, count: crmOrders.length };
  }, [crmOrders]);

  // Filtered CRM Orders
  const filteredCrmOrders = useMemo(() => {
    return crmOrders.filter((o) => {
      const matchesStatus = crmStatusFilter === 'all' || o.status === crmStatusFilter;
      const matchesSearch = 
        o.title.toLowerCase().includes(crmSearch.toLowerCase()) ||
        o.clientName.toLowerCase().includes(crmSearch.toLowerCase()) ||
        o.clientPhone.toLowerCase().includes(crmSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [crmOrders, crmStatusFilter, crmSearch]);

  // Filtered Client Orders from Exchange
  const filteredExchangeOrders = useMemo(() => {
    return clientOrders.filter((ord) => {
      if (exchangeCityFilter === 'all') return true;
      if (exchangeCityFilter === 'my') return ord.city === partnerCity;
      return ord.city === exchangeCityFilter;
    });
  }, [clientOrders, exchangeCityFilter, partnerCity]);

  return (
    <div className="space-y-6">
      
      {/* Top Partner Navigation Tabs (Desktop & Tablet) */}
      <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setPartnerTab('bids')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              partnerTab === 'bids'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Биржа заказов</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 font-mono">
              {clientOrders.length}
            </span>
          </button>

          <button
            onClick={() => setPartnerTab('calc')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              partnerTab === 'calc'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Калькулятор & Создание</span>
          </button>

          <button
            onClick={() => setPartnerTab('filaments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              partnerTab === 'filaments'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Склад пластика</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 font-mono">
              {spools.length}
            </span>
          </button>

          <button
            onClick={() => setPartnerTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              partnerTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>База заказов CRM</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/40 font-mono">
              {crmOrders.length}
            </span>
          </button>

          <button
            onClick={() => setPartnerTab('finance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              partnerTab === 'finance'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Финансы</span>
          </button>

          <button
            onClick={() => setPartnerTab('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              partnerTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Календарь</span>
          </button>
        </div>

        <button
          onClick={() => setIsTariffModalOpen(true)}
          className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-800"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Тарифы мастера</span>
        </button>
      </div>

      {/* Confirmation Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= TAB 1: CLIENT EXCHANGE (БИРЖА ЗАКАЗОВ) ================= */}
      {partnerTab === 'bids' && (
        <div className="space-y-5">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#12121a] p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Входящие клиентские заявки (Биржа заказов)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Клиенты предлагают свою цену. Вы можете согласиться или сделать встречное предложение.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Город:</span>
              <select
                value={exchangeCityFilter}
                onChange={(e) => setExchangeCityFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#181824] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Весь Казахстан ({clientOrders.length})</option>
                <option value="my">Мой город ({partnerCity})</option>
                {KAZAKHSTAN_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredExchangeOrders.length === 0 ? (
            <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <ListCheck className="w-10 h-10 mx-auto text-slate-600" />
              <div className="text-sm font-semibold text-slate-300">В этом городе пока нет открытых заявок</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Переключите фильтр на «Весь Казахстан», чтобы посмотреть заказы из соседних регионов.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExchangeOrders.map((ord) => {
                const myBid = (ord.bids || []).find((b) => b.makerName.includes(partnerUser.name) || b.city === partnerCity);
                
                return (
                  <div
                    key={ord.id}
                    className="bg-[#12121a] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              {ord.serviceLabel || ord.category || '3D-печать'}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-orange-400 font-mono">
                              <MapPin className="w-3 h-3" />
                              {ord.city}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white font-heading">
                            {ord.title}
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">Бюджет заказчика</span>
                          <span className="text-base font-bold text-emerald-400 font-mono">
                            {ord.clientOfferedBudget?.toLocaleString()} ₸
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {ord.description}
                      </p>

                      {ord.dimensions && (
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
                          <span>Габариты: {ord.dimensions.x}×{ord.dimensions.y}×{ord.dimensions.z} мм</span>
                          <span>•</span>
                          <span>Срок: {ord.urgency}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="text-xs text-slate-400">
                        {myBid ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Ваша ставка: {myBid.offeredPrice.toLocaleString()} ₸
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            Ставок мастеров: {(ord.bids || []).length}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setBidModalOrder(ord);
                            setBidPrice(ord.clientOfferedBudget || 4500);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{myBid ? 'Изменить ставку' : 'Предложить цену'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2: ADVANCED CALCULATOR (FROM qlab_calc.html) ================= */}
      {partnerTab === 'calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Client + Parameters (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
              
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  1. Данные клиента и заказа
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CRM Auto-Save</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Имя клиента</label>
                  <input
                    type="text"
                    value={calcClientName}
                    onChange={(e) => setCalcClientName(e.target.value)}
                    placeholder="Алихан"
                    className="w-full bg-[#181824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Телефон / WhatsApp</label>
                  <input
                    type="text"
                    value={calcClientPhone}
                    onChange={(e) => setCalcClientPhone(e.target.value)}
                    placeholder="+7 707 000 0000"
                    className="w-full bg-[#181824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Срок сдачи (Дедлайн)</label>
                  <input
                    type="date"
                    value={calcDeadline}
                    onChange={(e) => setCalcDeadline(e.target.value)}
                    className="w-full bg-[#181824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Статус заказа</label>
                  <select
                    value={calcStatus}
                    onChange={(e) => setCalcStatus(e.target.value)}
                    className="w-full bg-[#181824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="queue">В очереди</option>
                    <option value="printing">В печати</option>
                    <option value="ready">Готов</option>
                    <option value="completed">Выдан и оплачен</option>
                  </select>
                </div>
              </div>

              <div className="border-b border-slate-800 pt-2 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  2. Параметры изделия и печати
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Формула QLab</span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Наименование детали / модели</label>
                <input
                  type="text"
                  value={calcTitle}
                  onChange={(e) => setCalcTitle(e.target.value)}
                  className="w-full bg-[#181824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Spool selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1 flex justify-between">
                  <span>Катушка пластика со склада</span>
                  {currentCalculation.selectedSpool && (
                    <span className="font-mono text-[11px] text-emerald-400">
                      Остаток: {currentCalculation.selectedSpool.remaining} г
                    </span>
                  )}
                </label>
                <select
                  value={calcSpoolId}
                  onChange={(e) => setCalcSpoolId(e.target.value)}
                  className="w-full bg-[#181824] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {spools.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.type}] {s.brand} — {s.colorName} ({s.remaining}г из {s.weight}г) • {s.price} ₸
                    </option>
                  ))}
                  <option value="default">Базовый тариф (6 000 ₸/кг, без списания)</option>
                </select>
              </div>

              {currentCalculation.isSpoolLow && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Внимание: на выбранной катушке меньше пластика, чем требуется для тиража!</span>
                </div>
              )}

              {/* Weight stepper */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                <div>
                  <div className="font-medium text-white text-xs">Вес 1 штуки</div>
                  <div className="text-[10px] text-slate-500 font-mono">модель + поддержки + сброс AMS</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#181824] border border-slate-700 rounded-lg overflow-hidden">
                    <button onClick={() => setCalcWeight(Math.max(1, Number(calcWeight) - 5))} className="stepper-btn">−</button>
                    <input
                      type="number"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(e.target.value)}
                      className="w-16 bg-transparent text-center font-mono font-bold text-xs text-white outline-none"
                    />
                    <button onClick={() => setCalcWeight(Number(calcWeight) + 5)} className="stepper-btn">+</button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-[#181824] px-2 py-1.5 rounded-md border border-slate-700">г</span>
                </div>
              </div>

              {/* Time stepper */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                <div>
                  <div className="font-medium text-white text-xs">Время печати 1 штуки</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    = {currentCalculation.singleHours.toFixed(2)} ч
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-[#181824] border border-slate-700 rounded-lg overflow-hidden">
                    <button onClick={() => setCalcHours(Math.max(0, Number(calcHours) - 1))} className="stepper-btn">−</button>
                    <input
                      type="number"
                      value={calcHours}
                      onChange={(e) => setCalcHours(e.target.value)}
                      className="w-12 bg-transparent text-center font-mono font-bold text-xs text-white outline-none"
                    />
                    <button onClick={() => setCalcHours(Number(calcHours) + 1)} className="stepper-btn">+</button>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">ч</span>

                  <div className="flex items-center bg-[#181824] border border-slate-700 rounded-lg overflow-hidden">
                    <button onClick={() => setCalcMinutes(Math.max(0, Number(calcMinutes) - 5))} className="stepper-btn">−</button>
                    <input
                      type="number"
                      value={calcMinutes}
                      onChange={(e) => setCalcMinutes(e.target.value)}
                      className="w-12 bg-transparent text-center font-mono font-bold text-xs text-white outline-none"
                    />
                    <button onClick={() => setCalcMinutes(Math.min(59, Number(calcMinutes) + 5))} className="stepper-btn">+</button>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">м</span>
                </div>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                <div>
                  <div className="font-medium text-white text-xs">Количество копий (тираж)</div>
                  <div className="text-[10px] text-slate-500 font-mono">автопересчет затрат и цены</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#181824] border border-slate-700 rounded-lg overflow-hidden">
                    <button onClick={() => setCalcQty(Math.max(1, Number(calcQty) - 1))} className="stepper-btn">−</button>
                    <input
                      type="number"
                      value={calcQty}
                      onChange={(e) => setCalcQty(e.target.value)}
                      className="w-16 bg-transparent text-center font-mono font-bold text-xs text-white outline-none"
                    />
                    <button onClick={() => setCalcQty(Number(calcQty) + 1)} className="stepper-btn">+</button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-[#181824] px-2 py-1.5 rounded-md border border-slate-700">шт</span>
                </div>
              </div>

              {/* CAD fee stepper */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-white text-xs">Подготовка модели / 3D CAD</div>
                  <div className="text-[10px] text-slate-500 font-mono">доход за моделирование и обработку</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#181824] border border-slate-700 rounded-lg overflow-hidden">
                    <button onClick={() => setCalcCadFee(Math.max(0, Number(calcCadFee) - 500))} className="stepper-btn">−</button>
                    <input
                      type="number"
                      value={calcCadFee}
                      onChange={(e) => setCalcCadFee(e.target.value)}
                      className="w-20 bg-transparent text-center font-mono font-bold text-xs text-white outline-none"
                    />
                    <button onClick={() => setCalcCadFee(Number(calcCadFee) + 500)} className="stepper-btn">+</button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-[#181824] px-2 py-1.5 rounded-md border border-slate-700">₸</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Result KPI Cards + Detailed Financial Breakdown (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* The 3 KPI Result Cards from qlab_calc.html */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
                РЕЗУЛЬТАТ РАСЧЕТА
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                
                {/* Metric 1: ЦЕНА КЛИЕНТУ */}
                <div className="metric-card m-price">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">ЦЕНА КЛИЕНТУ</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#a78bfa] mt-1 truncate">
                    {currentCalculation.clientPrice.toLocaleString()} ₸
                  </div>
                </div>

                {/* Metric 2: ПРИБЫЛЬ */}
                <div className="metric-card m-profit">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">ПРИБЫЛЬ</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 truncate">
                    {Math.round(currentCalculation.profit).toLocaleString()} ₸
                  </div>
                </div>

                {/* Metric 3: МАРЖА */}
                <div className="metric-card m-margin">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">МАРЖА</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
                    {currentCalculation.margin}%
                  </div>
                </div>

              </div>
            </div>

            {/* Detailed Financial Breakdown Card */}
            <div className="bg-[#0f1118] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex justify-between items-center border-b border-slate-800 pb-3">
                <span>ИТОГОВЫЙ ФИНАНСОВЫЙ РАСЧЕТ</span>
                <span className="text-emerald-400 font-mono text-xs">
                  {calcQty} шт ({calcWeight}г × {calcQty} = {currentCalculation.totalWeight}г)
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Пластик ({Math.round(currentCalculation.totalWeight)} г):</span>
                  <span className="font-mono font-medium text-slate-200">
                    {Math.round(currentCalculation.costPlastic).toLocaleString()} ₸
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Электроэнергия ({currentCalculation.totalKwh.toFixed(2)} кВт):</span>
                  <span className="font-mono font-medium text-slate-200">
                    {Math.round(currentCalculation.costPower).toLocaleString()} ₸
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Амортизация принтера ({currentCalculation.totalHours.toFixed(1)} ч):</span>
                  <span className="font-mono font-medium text-slate-200">
                    {Math.round(currentCalculation.costDeprec).toLocaleString()} ₸
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>Риски и брак (10%):</span>
                  <span className="font-mono font-medium text-slate-200">
                    {Math.round(currentCalculation.costRisk).toLocaleString()} ₸
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Себестоимость печати (траты):</span>
                  <span className="font-mono text-amber-400">
                    {Math.round(currentCalculation.costPrintTotal).toLocaleString()} ₸
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span>+ Работа за подготовку модели (CAD):</span>
                  <span className="font-mono text-slate-200">
                    {Number(calcCadFee).toLocaleString()} ₸
                  </span>
                </div>

                {calcQty > 1 && (
                  <div className="text-[11px] text-slate-500 font-mono pt-2 flex justify-between border-t border-slate-800/60">
                    <span>Цена за 1 единицу:</span>
                    <span className="text-slate-300 font-bold font-mono">
                      {Math.round(currentCalculation.clientPrice / calcQty).toLocaleString()} ₸
                    </span>
                  </div>
                )}
              </div>

              {/* Create CRM Order Button */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSaveOrderToCrm}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>Создать заказ в базу данных CRM</span>
                </button>
                <div className="text-[10px] text-center text-slate-500 font-mono">
                  Заказ сохранится в историю, с катушки спишется {currentCalculation.totalWeight}г пластика
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 3: FILAMENT WAREHOUSE (СКЛАД ПЛАСТИКА) ================= */}
      {partnerTab === 'filaments' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#12121a] p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Склад пластика и катушек
              </h3>
              <p className="text-xs text-slate-400">
                Учет остатков катушек, автоматическое списание при печати и контроль запасов.
              </p>
            </div>

            <button
              onClick={() => setIsAddSpoolOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить катушку</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spools.map((spool) => {
              const pct = Math.round((spool.remaining / spool.weight) * 100);
              const isLow = pct < 20;

              return (
                <div
                  key={spool.id}
                  className="bg-[#12121a] border border-slate-800 rounded-2xl p-4 space-y-3 relative shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {spool.type}
                    </span>
                    <button
                      onClick={() => setSpools(spools.filter(s => s.id !== spool.id))}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      title="Удалить катушку"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-inner"
                      style={{ backgroundColor: spool.colorHex }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {spool.brand}
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        {spool.colorName}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Остаток:</span>
                      <span className={`font-bold ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {spool.remaining} г ({pct}%)
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isLow ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Закупка: {spool.price.toLocaleString()} ₸</span>
                    <button
                      onClick={() => {
                        const added = prompt(`Добавить граммы к катушке «${spool.colorName}»:`, '1000');
                        if (added && !isNaN(Number(added))) {
                          setSpools(spools.map(s => s.id === spool.id ? { ...s, remaining: s.remaining + Number(added) } : s));
                        }
                      }}
                      className="text-emerald-400 hover:underline text-[10px]"
                    >
                      + Пополнить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= TAB 4: CRM ORDERS HISTORY ================= */}
      {partnerTab === 'orders' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#12121a] p-4 rounded-2xl border border-slate-800">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Все' },
                { id: 'printing', label: 'В печати' },
                { id: 'queue', label: 'В очереди' },
                { id: 'ready', label: 'Готовы' },
                { id: 'completed', label: 'Выданы' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCrmStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    crmStatusFilter === f.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label} ({crmOrders.filter(o => f.id === 'all' || o.status === f.id).length})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={crmSearch}
                onChange={(e) => setCrmSearch(e.target.value)}
                placeholder="Поиск по клиенту / детали..."
                className="w-full bg-[#181824] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#12121a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0b12] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">ID / Дедлайн</th>
                    <th className="p-3.5">Клиент / Контакт</th>
                    <th className="p-3.5">Изделие</th>
                    <th className="p-3.5">Вес / Пластик</th>
                    <th className="p-3.5 text-right">Себестоимость</th>
                    <th className="p-3.5 text-right">Цена</th>
                    <th className="p-3.5 text-right">Прибыль</th>
                    <th className="p-3.5 text-center">Статус</th>
                    <th className="p-3.5 text-center">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {filteredCrmOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        <div>{ord.id}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{ord.deadline || ord.date}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200 font-sans font-medium">{ord.clientName}</div>
                        <div className="text-[11px] text-slate-400">{ord.clientPhone}</div>
                      </td>
                      <td className="p-3.5 font-sans">
                        <div className="font-medium text-white">{ord.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{ord.qty} шт • ~{ord.totalHours?.toFixed(1)} ч</div>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{ord.totalWeight} г</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{ord.spoolName}</div>
                      </td>
                      <td className="p-3.5 text-right text-amber-400">
                        {ord.costPrint?.toLocaleString()} ₸
                      </td>
                      <td className="p-3.5 text-right text-white font-bold">
                        {ord.clientPrice?.toLocaleString()} ₸
                      </td>
                      <td className="p-3.5 text-right text-emerald-400 font-bold">
                        +{ord.profit?.toLocaleString()} ₸
                      </td>
                      <td className="p-3.5 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setCrmOrders(crmOrders.map(o => o.id === ord.id ? { ...o, status: newStatus } : o));
                          }}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-lg border font-mono ${
                            ord.status === 'printing'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : ord.status === 'ready'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : ord.status === 'completed'
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          <option value="queue">В очереди</option>
                          <option value="printing">В печати</option>
                          <option value="ready">Готов</option>
                          <option value="completed">Выдан</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setCrmOrders(crmOrders.filter(o => o.id !== ord.id))}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Удалить заказ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCrmOrders.length === 0 && (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <ListCheck className="w-8 h-8 mx-auto text-slate-600" />
                <div className="text-xs font-semibold text-slate-400">Список заказов пуст</div>
                <p className="text-[11px] text-slate-500">Заполните поля в калькуляторе и нажмите «Создать заказ»</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= TAB 5: FINANCIAL ANALYTICS ================= */}
      {partnerTab === 'finance' && (
        <div className="space-y-6">
          
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#12121a] border border-slate-800 p-4 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Выручка</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white">
                {financialMetrics.totalRev.toLocaleString()} ₸
              </div>
              <div className="text-[10px] text-emerald-400">Оплачено</div>
            </div>

            <div className="bg-[#12121a] border border-slate-800 p-4 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Чистая прибыль</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                {financialMetrics.totalProfit.toLocaleString()} ₸
              </div>
              <div className="text-[10px] text-slate-400">
                Рентабельность: <span className="font-mono font-bold text-amber-400">{financialMetrics.margin}%</span>
              </div>
            </div>

            <div className="bg-[#12121a] border border-slate-800 p-4 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Прямые затраты</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                {financialMetrics.totalCost.toLocaleString()} ₸
              </div>
              <div className="text-[10px] text-slate-500">Пластик + свет + аморт.</div>
            </div>

            <div className="bg-[#12121a] border border-slate-800 p-4 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Средний чек</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-slate-200">
                {financialMetrics.avgCheck.toLocaleString()} ₸
              </div>
              <div className="text-[10px] text-slate-500">На 1 заказ</div>
            </div>

            <div className="bg-[#12121a] border border-slate-800 p-4 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Расход пластика</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400">
                {financialMetrics.totalPlasticKg.toFixed(2)} кг
              </div>
              <div className="text-[10px] text-slate-500">Все заказы</div>
            </div>

            <div className="bg-[#12121a] border border-slate-800 p-4 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Всего заказов</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white">
                {financialMetrics.count}
              </div>
              <div className="text-[10px] text-slate-500">В базе CRM</div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Структура прямых затрат (Себестоимость)
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Пластик (филамент)</span>
                    <span className="font-mono text-white font-medium">55%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Амортизация и износ принтера</span>
                    <span className="font-mono text-white font-medium">30%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Риски и брак (10%)</span>
                    <span className="font-mono text-white font-medium">10%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Электроэнергия</span>
                    <span className="font-mono text-white font-medium">5%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Рентабельность и ценообразование
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Формула QLab обеспечивает устойчивую маржинальность 70–80% за счет высокой скорости печати на Bambu Lab (до 500 мм/с) и объединения тиражей.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Средняя рентабельность заказов:</span>
                  <span className="font-mono text-emerald-400 font-bold">{financialMetrics.margin}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Чистая прибыль на килограмм пластика:</span>
                  <span className="font-mono text-white font-bold">~32 000 ₸/кг</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 6: PRODUCTION CALENDAR ================= */}
      {partnerTab === 'calendar' && (
        <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-heading">
              Производственный календарь сдачи заказов
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {crmOrders.length} активных заказов
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {crmOrders.map((ord) => (
              <div key={ord.id} className="p-3.5 rounded-xl bg-[#181824] border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{ord.id}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{ord.deadline}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{ord.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{ord.clientName}</span>
                  <span className="font-mono text-amber-400">{ord.clientPrice.toLocaleString()} ₸</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SPOOL ================= */}
      {isAddSpoolOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141e] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading">Добавить катушку пластика на склад</h3>
              <button onClick={() => setIsAddSpoolOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSpool} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Бренд / Модель</label>
                <input
                  type="text"
                  value={newSpoolBrand}
                  onChange={(e) => setNewSpoolBrand(e.target.value)}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Тип пластика</label>
                  <select
                    value={newSpoolType}
                    onChange={(e) => setNewSpoolType(e.target.value)}
                    className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="PLA">PLA</option>
                    <option value="PETG">PETG</option>
                    <option value="ABS">ABS</option>
                    <option value="TPU">TPU</option>
                    <option value="PA-CF">PA-CF (Карбон)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Цвет катушки</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newSpoolHex}
                      onChange={(e) => setNewSpoolHex(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newSpoolColor}
                      onChange={(e) => setNewSpoolColor(e.target.value)}
                      className="flex-1 bg-[#1b1b28] border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Вес нетто (г)</label>
                  <input
                    type="number"
                    value={newSpoolWeight}
                    onChange={(e) => setNewSpoolWeight(e.target.value)}
                    className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Цена закупки (₸)</label>
                  <input
                    type="number"
                    value={newSpoolPrice}
                    onChange={(e) => setNewSpoolPrice(e.target.value)}
                    className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSpoolOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Сохранить катушку
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TARIFF SETTINGS ================= */}
      {isTariffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141e] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading">Настройки тарифов мастерской</h3>
              <button onClick={() => setIsTariffModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Тариф продажи пластика клиенту (₸/г)</label>
                <input
                  type="number"
                  value={tariffs.clientRateMatPerGram}
                  onChange={(e) => setTariffs({ ...tariffs, clientRateMatPerGram: Number(e.target.value) })}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Тариф продажи времени печати (₸/час)</label>
                <input
                  type="number"
                  value={tariffs.clientRateTimePerHour}
                  onChange={(e) => setTariffs({ ...tariffs, clientRateTimePerHour: Number(e.target.value) })}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Тариф эл-ва (₸/кВт)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tariffs.powerKwhPrice}
                    onChange={(e) => setTariffs({ ...tariffs, powerKwhPrice: Number(e.target.value) })}
                    className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Мощность принтера (Вт)</label>
                  <input
                    type="number"
                    value={tariffs.printerWatts}
                    onChange={(e) => setTariffs({ ...tariffs, printerWatts: Number(e.target.value) })}
                    className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Амортизация принтера (₸/час)</label>
                <input
                  type="number"
                  value={tariffs.depreciationPerHour}
                  onChange={(e) => setTariffs({ ...tariffs, depreciationPerHour: Number(e.target.value) })}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsTariffModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Применить тарифы
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MAKE A BID ON CLIENT ORDER ================= */}
      {bidModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141e] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Сделать предложение заказчику</h3>
                <span className="text-[11px] text-slate-400">{bidModalOrder.title}</span>
              </div>
              <button onClick={() => setBidModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] flex justify-between">
                <span className="text-slate-400">Бюджет заказчика:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {bidModalOrder.clientOfferedBudget?.toLocaleString()} ₸
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ваша цена (₸)</label>
                <input
                  type="number"
                  step="250"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Срок изготовления</label>
                <select
                  value={bidHours}
                  onChange={(e) => setBidHours(e.target.value)}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="4-6 часов">Экспресс: 4-6 часов</option>
                  <option value="24 часа">Стандарт: 24 часа</option>
                  <option value="48 часов">Сложный заказ: 48 часов</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Оборудование мастерской</label>
                <input
                  type="text"
                  value={bidEquipment}
                  onChange={(e) => setBidEquipment(e.target.value)}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Комментарий / условия</label>
                <textarea
                  rows="2"
                  value={bidComment}
                  onChange={(e) => setBidComment(e.target.value)}
                  className="w-full bg-[#1b1b28] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setBidModalOrder(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handlePlaceBidOnClientOrder}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Отправить предложение
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
