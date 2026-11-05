// Материалы и параметры для 3D-печати на станциях QLab

export const PRINT_MATERIALS = [
  {
    id: 'pla-silk',
    name: 'Silk PLA (Шелковый глянец)',
    category: 'Декор и мерч',
    colorExamples: ['Золото Казахстана', 'Серебристый металлик', 'Изумрудный шелк', 'Глубокий синий'],
    features: 'Премиальный блеск, безупречная эстетика для подарков и сувениров',
    pricePerGramMultiplier: 1.15,
    recommendedFor: ['Национальные салфетницы', 'Литофания', 'Косплей', 'Подарки'],
    bedTemp: '55-60°C',
    strength: 'Средняя (интерьерная)',
    bambuReady: true,
  },
  {
    id: 'pla-basic',
    name: 'PLA Matte / Standard',
    category: 'Базовый прототип',
    colorExamples: ['Матовый черный', 'Белый фарфор', 'Сигнальный оранжевый QLab', 'Серый графит'],
    features: 'Высокая детализация, эко-биоразлагаемый, идеально для быстрых макетов',
    pricePerGramMultiplier: 1.0,
    recommendedFor: ['Корпуса', 'Подставки для телефонов', 'Макеты', 'Игрушки'],
    bedTemp: '50-60°C',
    strength: 'Стандартная',
    bambuReady: true,
  },
  {
    id: 'petg',
    name: 'PETG Прочный',
    category: 'Функциональный пластик',
    colorExamples: ['Черный карбон', 'Прозрачный кристалл', 'Темно-серый'],
    features: 'Ударопрочный, влагостойкий, термостойкость до 75°C, стоек к бензину и химии',
    pricePerGramMultiplier: 1.1,
    recommendedFor: ['Автомобильные клипсы', 'Крепления', 'Детали техники', 'Держатели'],
    bedTemp: '75-80°C',
    strength: 'Высокая',
    bambuReady: true,
  },
  {
    id: 'pa-cf',
    name: 'Carbon Fiber Nylon (PA-CF)',
    category: 'Суперинженерия',
    colorExamples: ['Матовый черный карбон'],
    features: 'Армирован углеволокном, экстремальная жесткость, термостойкость до 150°C, замена металла',
    pricePerGramMultiplier: 1.85,
    recommendedFor: ['Шестерни редукторов', 'Кронштейны ДВС', 'Тюнинг авто', 'Нагруженные узлы'],
    bedTemp: '90-100°C',
    strength: 'Экстремальная (прочнее литого пластика)',
    bambuReady: true, // Only on Bambu P1S / X1 with hardened nozzle!
  },
  {
    id: 'abs',
    name: 'ABS / ASA Инженерный',
    category: 'Авто-тюнинг',
    colorExamples: ['Черный', 'Белый', 'Красный'],
    features: 'Термостойкость до 100°C, легко шлифуется, устойчив к жаре под капотом',
    pricePerGramMultiplier: 1.25,
    recommendedFor: ['Заглушки бампера', 'Дефлекторы', 'Элементы салона авто'],
    bedTemp: '90-100°C',
    strength: 'Очень высокая',
    bambuReady: true,
  },
  {
    id: 'tpu',
    name: 'TPU 95A (Эластичный резинопласт)',
    category: 'Гибкие детали',
    colorExamples: ['Черный резиновый', 'Ярко-оранжевый'],
    features: 'Гнется, поглощает удары и вибрацию, устойчив к истиранию и маслу',
    pricePerGramMultiplier: 1.4,
    recommendedFor: ['Амортизаторы', 'Демпферы', 'Защитные чехлы', 'Уплотнители'],
    bedTemp: '50-60°C',
    strength: 'Гибкая / Неразрывная',
    bambuReady: true,
  },
];

// Официальная формула QLab из Pitch Deck (слайд 10):
// Вес × 50 ₸ + Время(часы) × 100 ₸ + База 2000 ₸
export function calculatePrintPrice({
  weightGrams = 50,
  printTimeMinutes = 120,
  materialId = 'pla-basic',
  infillPercent = 20,
  quantity = 1,
}) {
  const material = PRINT_MATERIALS.find((m) => m.id === materialId) || PRINT_MATERIALS[1];
  const timeHours = printTimeMinutes / 60;

  // Базовые компоненты формулы
  const weightCost = weightGrams * 50 * material.pricePerGramMultiplier;
  const timeCost = timeHours * 100;
  const baseCost = 2000;

  // Коэффициент заполнения (выше 30% увеличивает плотность и вес)
  const infillMultiplier = 1 + ((infillPercent - 20) / 100) * 0.4;

  const singlePrice = Math.round((baseCost + weightCost * infillMultiplier + timeCost));

  // Оптовая скидка QLab (при заказе от 5 шт -10%, от 20 шт -20%, от 50 шт -30%)
  let discount = 0;
  if (quantity >= 50) discount = 0.30;
  else if (quantity >= 20) discount = 0.20;
  else if (quantity >= 5) discount = 0.10;

  const totalPrice = Math.round(singlePrice * quantity * (1 - discount));

  return {
    singlePrice,
    totalPrice,
    breakdown: {
      baseCost,
      weightCost: Math.round(weightCost * infillMultiplier),
      timeCost: Math.round(timeCost),
      materialMultiplier: material.pricePerGramMultiplier,
      discountPercent: Math.round(discount * 100),
      rawFormula: `${weightGrams}г × 50₸ + ${timeHours.toFixed(1)}ч × 100₸ + 2000₸`,
    },
  };
}
