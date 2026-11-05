import React, { useState } from 'react';
import { 
  PlusCircle, MessageSquare, Send, CheckCircle2, Clock, 
  MapPin, Upload, FileText, Check, DollarSign, Wrench, 
  Layers, Zap, ChevronRight, X 
} from 'lucide-react';
import { findNearestHub } from '../data/cities';

export default function CustomPrintInDrive({
  user,
  userCity,
  orders,
  onUpdateOrders,
  activeRole,
}) {
  const [activeSubTab, setActiveSubTab] = useState('feed');
  const [filterCityOnly, setFilterCityOnly] = useState(false);
  const [filterType, setFilterType] = useState('all');
  
  const [newTitle, setNewTitle] = useState('');
  const [newServiceType, setNewServiceType] = useState('cad_and_print');
  const [newDescription, setNewDescription] = useState('');
  const [dimX, setDimX] = useState(60);
  const [dimY, setDimY] = useState(60);
  const [dimZ, setDimZ] = useState(30);
  const [newBudget, setNewBudget] = useState(5000);
  const [newUrgency, setNewUrgency] = useState('24-48 часов');
  const [newAttachedFiles, setNewAttachedFiles] = useState([
    { name: 'sample_part_blueprint.png', size: '1.2 MB', type: 'image' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedOrderForChat, setSelectedOrderForChat] = useState(null);
  const [chatInput, setChatInput] = useState('');

  const [orderForNewBid, setOrderForNewBid] = useState(null);
  const [makerBidPrice, setMakerBidPrice] = useState('');
  const [makerBidTime, setMakerBidTime] = useState('24 часа');
  const [makerBidComment, setMakerBidComment] = useState('');

  const hubInfo = findNearestHub(userCity);

  const displayOrders = orders.filter((ord) => {
    if (filterCityOnly && ord.city.toLowerCase() !== userCity.toLowerCase()) {
      return false;
    }
    if (filterType !== 'all' && ord.serviceType !== filterType) {
      return false;
    }
    return true;
  });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = {
        id: `ord-${Date.now().toString().slice(-4)}`,
        title: newTitle,
        serviceType: newServiceType,
        serviceLabel:
          newServiceType === 'print_only'
            ? 'Только 3D-печать (есть STL)'
            : newServiceType === 'cad_only'
            ? '3D-Моделирование (CAD)'
            : newServiceType === 'scan_reverse'
            ? '3D-Сканирование и реверс'
            : '3D-Моделирование и Печать',
        category: 'Инженерия и кастом',
        status: 'open_bidding',
        statusLabel: 'Сбор предложений',
        city: userCity,
        client: {
          name: user.name || 'Заказчик',
          phone: user.phone || '+7 707 789 0369',
          rating: 5.0,
          ordersCount: 1,
        },
        clientOfferedBudget: Number(newBudget),
        description: newDescription || 'Кастомная деталь по образцу или чертежу.',
        dimensions: { x: Number(dimX), y: Number(dimY), z: Number(dimZ) },
        strengthRequired: 'Стандартная функциональная',
        heatResistance: 'до 70°C',
        urgency: newUrgency,
        urgencyBadge: newUrgency.includes('24') ? 'Срочно' : 'Стандарт',
        attachments: newAttachedFiles,
        bids: [],
        chatMessages: [],
      };

      setTimeout(() => {
        const simulatedBid = {
          id: `bid-resp-${Date.now()}`,
          makerId: 'mkr-hub',
          makerName: hubInfo.isLocal ? `Мастерская (${userCity})` : `Хаб (${hubInfo.hub.name})`,
          specialization: newServiceType.includes('cad') ? 'Инженер CAD / Реверс-инжиниринг' : '3D-Печатник',
          equipment: 'Bambu Lab P1S Combo',
          rating: 4.95,
          reviewsCount: 28,
          city: hubInfo.hub.name,
          offeredPrice: Number(newBudget) > 0 ? Number(newBudget) : 5500,
          proposedTime: hubInfo.isLocal ? '12-24 ч' : '24 часа + доставка',
          comment: `Здравствуйте. Готов выполнить заказ по вашей цене ${Number(newBudget).toLocaleString()} ₸.`,
          createdAt: 'Только что',
          status: 'pending',
        };

        onUpdateOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, bids: [simulatedBid], status: 'negotiating', statusLabel: 'Есть 1 предложение' } : o))
        );
      }, 3000);

      onUpdateOrders([order, ...orders]);
      setIsSubmitting(false);
      setActiveSubTab('feed');
    }, 500);
  };

  const handleMakerSubmitBid = (e) => {
    e.preventDefault();
    if (!makerBidPrice) return;

    const newBidObj = {
      id: `bid-${Date.now().toString().slice(-4)}`,
      makerId: `mkr-${user.id || 'curr'}`,
      makerName: user.name || 'Специалист QLab',
      specialization: '3D-Печать и моделирование',
      equipment: 'Bambu Lab P1S Combo',
      rating: 5.0,
      reviewsCount: 14,
      city: userCity,
      offeredPrice: Number(makerBidPrice),
      proposedTime: makerBidTime,
      comment: makerBidComment || 'Готов выполнить качественно и в срок.',
      createdAt: 'Только что',
      status: 'pending',
    };

    onUpdateOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderForNewBid.id) {
          return {
            ...ord,
            status: 'negotiating',
            statusLabel: `Идут торги (${ord.bids.length + 1})`,
            bids: [newBidObj, ...ord.bids],
          };
        }
        return ord;
      })
    );

    setOrderForNewBid(null);
    setMakerBidPrice('');
    setMakerBidComment('');
  };

  const handleAcceptBid = (orderId, bidId) => {
    onUpdateOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const accepted = ord.bids.find((b) => b.id === bidId);
          return {
            ...ord,
            status: 'accepted',
            statusLabel: `Мастер выбран: ${accepted?.makerName}`,
            acceptedBid: accepted,
          };
        }
        return ord;
      })
    );
    setSelectedOrderForChat(null);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedOrderForChat) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: activeRole === 'maker' ? 'maker' : 'client',
      makerName: activeRole === 'maker' ? (user.name || 'Мастер') : undefined,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === selectedOrderForChat.id) {
          return {
            ...ord,
            chatMessages: [...(ord.chatMessages || []), newMsg],
          };
        }
        return ord;
      })
    );

    setSelectedOrderForChat((prev) => ({
      ...prev,
      chatMessages: [...(prev.chatMessages || []), newMsg],
    }));

    setChatInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-orange-400">
              Кастомная печать и моделирование
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              {activeRole === 'maker' ? 'Режим мастера' : 'Режим заказчика'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Заявки на изготовление деталей
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Предлагайте свою цену за деталь. 3D-модельеры подготовят CAD-файл, а печатники вашего города изготовят деталь в согласованный срок.
          </p>
        </div>

        <button
          onClick={() => setActiveSubTab(activeSubTab === 'create' ? 'feed' : 'create')}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shrink-0"
        >
          {activeSubTab === 'create' ? (
            <>
              <Layers className="w-4 h-4" />
              <span>К списку заявок</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Создать заявку</span>
            </>
          )}
        </button>
      </div>

      {/* City Status */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
          <span>
            Город: <strong className="text-white">{userCity}</strong>. {hubInfo.message}
          </span>
        </div>
      </div>

      {/* CREATE ORDER FORM */}
      {activeSubTab === 'create' && (
        <form
          onSubmit={handleCreateOrder}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6"
        >
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Новая заявка на деталь
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Укажите параметры детали и предложите комфортную стоимость.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Тип услуги
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'cad_and_print', title: 'Моделирование и печать', desc: 'По чертежу, фото или замерам' },
                { id: 'print_only', title: 'Только 3D-печать', desc: 'Есть готовый STL или STEP файл' },
                { id: 'scan_reverse', title: 'Реверс сломанной детали', desc: 'Восстановление поврежденного узла' },
                { id: 'cad_only', title: 'Только 3D-модель', desc: 'Нужен чертеж или CAD файл' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setNewServiceType(st.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    newServiceType === st.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">{st.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Название детали *</label>
              <input
                type="text"
                required
                placeholder="Например: Шестерня редуктора или Кронштейн"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Желаемый срок</label>
              <select
                value={newUrgency}
                onChange={(e) => setNewUrgency(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Срочно за 24 часа">Срочно (24 часа)</option>
                <option value="24-48 часов">Стандарт (24-48 часов)</option>
                <option value="В течение недели">В течение недели</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Описание и требования</label>
            <textarea
              rows={3}
              placeholder="Условия эксплуатации: нагрузки, трение, нагрев, контакт с химикатами или бензином..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">
                Габариты детали (мм)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Длина (X)</span>
                  <input
                    type="number"
                    value={dimX}
                    onChange={(e) => setDimX(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-center text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Ширина (Y)</span>
                  <input
                    type="number"
                    value={dimY}
                    onChange={(e) => setDimY(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-center text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Высота (Z)</span>
                  <input
                    type="number"
                    value={dimZ}
                    onChange={(e) => setDimZ(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-center text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">
                Файлы (STL, чертежи, фото)
              </label>
              <div className="border border-dashed border-slate-800 rounded-xl p-3 text-center bg-slate-950/60 cursor-pointer hover:border-slate-700">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-xs text-slate-300 block">
                  Перетащите файлы сюда или нажмите для выбора
                </span>
                <span className="text-[10px] text-slate-500">
                  Поддерживаются: STL, STEP, OBJ, PNG, JPG, PDF
                </span>
              </div>
            </div>
          </div>

          {/* Budget Input */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Ваша предлагаемая цена
              </label>
              <span className="text-xs text-slate-400">
                Ориентир: ~4,500 – 6,500 ₸
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-lg font-bold text-orange-400 font-mono focus:border-orange-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                  ₸
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[3500, 5000, 7500, 10000].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setNewBudget(b)}
                    className="px-2.5 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-mono"
                  >
                    {b.toLocaleString()} ₸
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveSubTab('feed')}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm transition-colors"
            >
              {isSubmitting ? 'Публикация...' : 'Опубликовать заявку'}
            </button>
          </div>

        </form>
      )}

      {/* FEED OF ORDERS */}
      {activeSubTab === 'feed' && (
        <div className="space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Все заявки' },
                { id: 'cad_and_print', label: 'Моделирование и печать' },
                { id: 'print_only', label: 'Только печать' },
                { id: 'cad_only', label: 'Только CAD' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    filterType === f.id
                      ? 'bg-slate-800 text-orange-400 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilterCityOnly(!filterCityOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                filterCityOnly
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Только мой город ({userCity})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {displayOrders.map((ord) => {
              const isLocalOrder = ord.city.toLowerCase() === userCity.toLowerCase();
              const hasBids = ord.bids && ord.bids.length > 0;

              return (
                <div
                  key={ord.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                        {ord.serviceLabel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        г. {ord.city}
                      </span>
                      <span className="text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                        {ord.urgencyBadge}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400">Бюджет заказчика:</span>
                      <span className="text-lg font-bold text-orange-400 font-mono">
                        {ord.clientOfferedBudget.toLocaleString()} ₸
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 space-y-2">
                      <h3 className="text-base font-semibold text-slate-100">
                        {ord.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ord.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>Габариты: <strong className="text-slate-300">{ord.dimensions.x}×{ord.dimensions.y}×{ord.dimensions.z} мм</strong></span>
                        <span>Требования: <strong className="text-slate-300">{ord.strengthRequired}</strong></span>
                        <span>Заказчик: <strong className="text-slate-300">{ord.client.name}</strong></span>
                      </div>

                      {ord.attachments && ord.attachments.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-500">Файлы:</span>
                          {ord.attachments.map((att, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono">
                              <FileText className="w-2.5 h-2.5 text-slate-400" />
                              {att.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-slate-400 font-medium">Предложения мастеров:</span>
                          <span className="text-slate-400 text-xs">
                            {ord.bids.length}
                          </span>
                        </div>

                        {hasBids ? (
                          <div className="space-y-2">
                            {ord.bids.slice(0, 2).map((bid) => (
                              <div key={bid.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-slate-200 truncate">{bid.makerName}</span>
                                  <span className="font-bold text-orange-400 font-mono">{bid.offeredPrice.toLocaleString()} ₸</span>
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                                  <span>{bid.proposedTime}</span>
                                  <span>г. {bid.city}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-xs text-slate-500">
                            Пока нет предложений мастеров
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        {activeRole === 'maker' ? (
                          <button
                            onClick={() => setOrderForNewBid(ord)}
                            className="w-full py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>Предложить цену и срок</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedOrderForChat(ord)}
                            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                            <span>Предложения и чат ({ord.bids.length})</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* MAKER BID MODAL */}
      {orderForNewBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-orange-400 font-semibold">Предложение мастера</span>
                <h3 className="text-base font-bold text-white truncate max-w-sm">
                  {orderForNewBid.title}
                </h3>
              </div>
              <button
                onClick={() => setOrderForNewBid(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              Бюджет заказчика: <strong className="text-orange-400">{orderForNewBid.clientOfferedBudget.toLocaleString()} ₸</strong> • 
              Срок: <strong className="text-slate-200">{orderForNewBid.urgency}</strong>
            </div>

            <form onSubmit={handleMakerSubmitBid} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Ваша цена (₸)
                </label>
                <input
                  type="number"
                  required
                  placeholder={`Например: ${orderForNewBid.clientOfferedBudget}`}
                  value={makerBidPrice}
                  onChange={(e) => setMakerBidPrice(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-base font-bold text-orange-400 font-mono focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Срок выполнения
                </label>
                <select
                  value={makerBidTime}
                  onChange={(e) => setMakerBidTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-orange-500"
                >
                  <option value="6-12 часов">6-12 часов</option>
                  <option value="24 часа">24 часа</option>
                  <option value="2 дня">2 дня</option>
                  <option value="3-4 дня">3-4 дня</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Комментарий
                </label>
                <textarea
                  rows={3}
                  placeholder="Оборудование, материал (PETG, Carbon Fiber) и детали..."
                  value={makerBidComment}
                  onChange={(e) => setMakerBidComment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Отправить предложение
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CHAT AND BIDS MODAL */}
      {selectedOrderForChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-orange-400">Согласование заказа</span>
                <h3 className="text-base font-bold text-slate-100 truncate max-w-md">
                  {selectedOrderForChat.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForChat(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              <div className="md:col-span-5 border-r border-slate-800 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Предложения ({selectedOrderForChat.bids.length})</span>
                  <span className="text-slate-400">Бюджет: {selectedOrderForChat.clientOfferedBudget.toLocaleString()} ₸</span>
                </div>

                {selectedOrderForChat.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={`p-3 rounded-xl border text-xs space-y-2 ${
                      selectedOrderForChat.status === 'accepted' && selectedOrderForChat.acceptedBid?.id === bid.id
                        ? 'bg-slate-900 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate max-w-[140px]">
                        {bid.makerName}
                      </span>
                      <span className="font-bold text-orange-400 font-mono">
                        {bid.offeredPrice.toLocaleString()} ₸
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>г. {bid.city}</span>
                      <span>{bid.proposedTime}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                      {bid.comment}
                    </p>

                    {selectedOrderForChat.status !== 'accepted' && (
                      <button
                        onClick={() => handleAcceptBid(selectedOrderForChat.id, bid.id)}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Принять предложение</span>
                      </button>
                    )}
                  </div>
                ))}

                {selectedOrderForChat.bids.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Ожидаются отклики мастеров
                  </div>
                )}
              </div>

              <div className="md:col-span-7 flex flex-col justify-between h-full bg-slate-900">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <div className="text-center text-[11px] text-slate-500 my-1">
                    Прямой диалог для согласования размеров и сроков
                  </div>

                  {(selectedOrderForChat.chatMessages || []).map((msg) => {
                    const isMe = msg.sender === (activeRole === 'maker' ? 'maker' : 'client');
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-2.5 rounded-xl text-xs ${
                            isMe
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {!isMe && (
                            <span className="text-[10px] text-orange-400 font-semibold block mb-0.5">
                              {msg.makerName || 'Заказчик'}
                            </span>
                          )}
                          <p>{msg.text}</p>
                          <span className="text-[9px] block text-right mt-1 opacity-70">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Напишите сообщение мастеру..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
