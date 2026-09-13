const BASE = `${API_URL}/api/gold`;
import { API_URL } from '../config/api.js';

export const TYPES = [
  ['XAUUSD', 'Vàng Thế Giới'],
  ['SJL1L10', 'SJC 9999'],
  ['SJ9999', 'Nhẫn SJC'],
  ['DOHNL', 'DOJI Hà Nội'],
  ['DOHCML', 'DOJI HCM'],
  ['DOJINHTV', 'DOJI Nữ Trang'],
  ['BTSJC', 'Bảo Tín SJC'],
  ['BT9999NTT', 'Bảo Tín 9999'],
  ['PQHNVM', 'PNJ Hà Nội'],
  ['PQHN24NTT', 'PNJ 24K'],
  ['VNGSJC', 'VN Gold SJC'],
  ['VIETTINMSJC', 'Viettin SJC'],
];

export async function getPrice(type) {
  const r = await fetch(`${BASE}/${type}`);

  if (!r.ok) {
    throw new Error('Không lấy được giá');
  }

  return r.json();
}

export async function getHistory(type, days = 7) {
  const r = await fetch(
    `${BASE}/${type}/history?days=${days}`
  );

  if (!r.ok) {
    throw new Error('Không lấy được lịch sử');
  }

  return r.json();
}

export async function getAllPrices() {
  const r = await fetch(BASE);

  if (!r.ok) {
    throw new Error('Không lấy được bảng giá');
  }

  return r.json();
}

export function normalizeOne(raw, fallbackType) {
  if (raw?.data && Array.isArray(raw.data)) return raw.data[0];
  return {
    type_code: raw.type || fallbackType,
    name: raw.name,
    buy: raw.buy,
    sell: raw.sell,
    change_buy: raw.change_buy,
    change_sell: raw.change_sell,
    update_time: raw.timestamp,
    time: raw.time,
    date: raw.date,
  };
}

export function parseHistory(raw, type) {
  const list = raw?.history || [];

  if (!Array.isArray(list)) return [];

  return list.map((x) => {
    const price = x.prices?.[type];

    return {
      label: x.date,
      buy: Number(price?.buy ?? 0),
      sell: Number(price?.sell ?? 0),
    };
  }).filter((x) => x.buy || x.sell);
}
