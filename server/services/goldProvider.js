const axios = require("axios");

const BASE_URL = "https://www.vang.today/api/prices";
const CACHE_TTL = 5 * 60 * 1000;

const cache = new Map();

function getCacheKey(type, days) {
  if (!type) return "all";
  if (days) return `history:${type}:${days}`;
  return `price:${type}`;
}

function getCached(key) {
  const item = cache.get(key);

  if (!item) return null;

  const isExpired =
    Date.now() - item.cachedAt > CACHE_TTL;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

function setCached(key, data) {
  cache.set(key, {
    data,
    cachedAt: Date.now(),
  });
}

async function getAllPrices() {
  const key = getCacheKey();

  const cached = getCached(key);

  if (cached) {
    console.log("Gold cache HIT:", key);
    return cached;
  }

  console.log("Gold cache MISS:", key);

  const response = await axios.get(BASE_URL);

  setCached(key, response.data);

  return response.data;
}

async function getPrice(type) {
  const key = getCacheKey(type);

  const cached = getCached(key);

  if (cached) {
    console.log("Gold cache HIT:", key);
    return cached;
  }

  console.log("Gold cache MISS:", key);

  const response = await axios.get(BASE_URL, {
    params: {
      type,
    },
  });

  setCached(key, response.data);

  return response.data;
}

async function getHistory(type, days = 7) {
  const key = getCacheKey(type, days);

  const cached = getCached(key);

  if (cached) {
    console.log("Gold cache HIT:", key);
    return cached;
  }

  console.log("Gold cache MISS:", key);

  const response = await axios.get(BASE_URL, {
    params: {
      type,
      days,
    },
  });

  setCached(key, response.data);

  return response.data;
}

module.exports = {
  getAllPrices,
  getPrice,
  getHistory,
};