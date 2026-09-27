const FX_URL =
  "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx";

const CACHE_TTL = 15 * 60 * 1000;

let cache = {
  data: null,
  fetchedAt: 0,
};

function parseNumber(value) {
  if (!value) return 0;

  return Number(
    String(value)
      .replace(/,/g, "")
      .trim()
  );
}

function getAttribute(xml, name) {
  const match = xml.match(
    new RegExp(`${name}="([^"]+)"`)
  );

  return match ? match[1] : null;
}

async function getUsdVndRate() {
  const now = Date.now();

  if (
    cache.data &&
    now - cache.fetchedAt < CACHE_TTL
  ) {
    return cache.data;
  }

  const response = await fetch(FX_URL);

  if (!response.ok) {
    throw new Error(
      `Không thể lấy tỷ giá Vietcombank: ${response.status}`
    );
  }

  const xml = await response.text();

  const usdMatch = xml.match(
    /<Exrate[^>]*CurrencyCode="USD"[^>]*\/?>/
  );

  if (!usdMatch) {
    throw new Error(
      "Không tìm thấy tỷ giá USD từ Vietcombank"
    );
  }

  const usdXml = usdMatch[0];

  const data = {
    currency: "USD",
    buyCash: parseNumber(
      getAttribute(usdXml, "Buy")
    ),
    buyTransfer: parseNumber(
      getAttribute(usdXml, "Transfer")
    ),
    sell: parseNumber(
      getAttribute(usdXml, "Sell")
    ),
    source: "Vietcombank",
    fetchedAt: new Date().toISOString(),
  };

  cache = {
    data,
    fetchedAt: now,
  };

  return data;
}

module.exports = {
  getUsdVndRate,
};