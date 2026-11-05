// База городов Казахстана

export const KAZAKHSTAN_CITIES = [
  { id: 'taldykorgan', name: 'Талдыкорган', lat: 45.0167, lon: 78.3667, hasHub: true, printersCount: 4, avgSpeedHours: 4 },
  { id: 'almaty', name: 'Алматы', lat: 43.2389, lon: 76.8897, hasHub: true, printersCount: 12, avgSpeedHours: 6 },
  { id: 'astana', name: 'Астана', lat: 51.1694, lon: 71.4491, hasHub: true, printersCount: 7, avgSpeedHours: 8 },
  { id: 'shymkent', name: 'Шымкент', lat: 42.3417, lon: 69.5901, hasHub: true, printersCount: 3, avgSpeedHours: 12 },
  { id: 'karaganda', name: 'Караганда', lat: 49.8019, lon: 73.1021, hasHub: true, printersCount: 2, avgSpeedHours: 12 },
  { id: 'aktobe', name: 'Актобе', lat: 50.2839, lon: 57.1670, hasHub: false, printersCount: 0 },
  { id: 'taraz', name: 'Тараз', lat: 42.9000, lon: 71.3667, hasHub: false, printersCount: 0 },
  { id: 'pavlodar', name: 'Павлодар', lat: 52.2856, lon: 76.9411, hasHub: false, printersCount: 0 },
  { id: 'semey', name: 'Семей', lat: 50.4111, lon: 80.2275, hasHub: false, printersCount: 0 },
  { id: 'oskemen', name: 'Усть-Каменогорск', lat: 49.9569, lon: 82.6075, hasHub: false, printersCount: 0 },
  { id: 'kostanay', name: 'Костанай', lat: 53.2144, lon: 63.6246, hasHub: false, printersCount: 0 },
  { id: 'kyzylorda', name: 'Кызылорда', lat: 44.8528, lon: 65.5092, hasHub: false, printersCount: 0 },
  { id: 'uralsk', name: 'Уральск', lat: 51.2333, lon: 51.3667, hasHub: false, printersCount: 0 },
  { id: 'petropavlovsk', name: 'Петропавловск', lat: 54.8667, lon: 69.1500, hasHub: false, printersCount: 0 },
  { id: 'aktau', name: 'Актау', lat: 43.6500, lon: 51.1500, hasHub: false, printersCount: 0 },
  { id: 'atyrau', name: 'Атырау', lat: 47.1167, lon: 51.8833, hasHub: false, printersCount: 0 },
  { id: 'konev', name: 'Конаев', lat: 43.8789, lon: 77.0697, hasHub: false, printersCount: 0 },
  { id: 'tekeli', name: 'Текели', lat: 44.8617, lon: 78.8286, hasHub: false, printersCount: 0 },
  { id: 'ushtobe', name: 'Уштобе', lat: 45.2514, lon: 77.9803, hasHub: false, printersCount: 0 },
  { id: 'zharkent', name: 'Жаркент', lat: 44.1667, lon: 80.0000, hasHub: false, printersCount: 0 },
  { id: 'balkhash', name: 'Балхаш', lat: 46.8481, lon: 74.9950, hasHub: false, printersCount: 0 },
];

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function findNearestHub(userCityName) {
  const currentCity = KAZAKHSTAN_CITIES.find(
    (c) => c.name.toLowerCase() === (userCityName || '').toLowerCase()
  ) || KAZAKHSTAN_CITIES[0];

  if (currentCity.hasHub && currentCity.printersCount > 0) {
    return {
      isLocal: true,
      currentCity,
      hub: currentCity,
      distanceKm: 0,
      deliveryTimeHours: currentCity.avgSpeedHours || 4,
      message: `В городе ${currentCity.name} работает локальное производство. Готовность от ${currentCity.avgSpeedHours} часов.`,
    };
  }

  const activeHubs = KAZAKHSTAN_CITIES.filter((c) => c.hasHub && c.printersCount > 0);
  let nearest = activeHubs[0];
  let minDistance = Infinity;

  for (const hub of activeHubs) {
    const dist = calculateDistanceKm(
      currentCity.lat,
      currentCity.lon,
      hub.lat,
      hub.lon
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  let deliveryHours = 24;
  if (minDistance < 150) deliveryHours = 6;
  else if (minDistance < 350) deliveryHours = 12;

  return {
    isLocal: false,
    currentCity,
    hub: nearest,
    distanceKm: minDistance,
    deliveryTimeHours: deliveryHours,
    message: `В городе ${currentCity.name} заказ изготавливается в ближайшем хабе: ${nearest.name} (${minDistance} км). Доставка за ${deliveryHours} ч.`,
  };
}
