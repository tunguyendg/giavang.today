const TROY_OUNCE_GRAMS = 31.1034768;
const LUONG_GRAMS = 37.5;

function convertWorldGoldToVndPerLuong(
  xauUsd,
  usdVnd
) {
  if (!xauUsd || !usdVnd) {
    throw new Error(
      "Thiếu dữ liệu XAU/USD hoặc USD/VND"
    );
  }

  const vndPerLuong =
    xauUsd *
    usdVnd *
    (LUONG_GRAMS / TROY_OUNCE_GRAMS);

  return Math.round(vndPerLuong);
}

function calculatePremium(
  sjcPrice,
  worldPriceVnd
) {
  if (!sjcPrice || !worldPriceVnd) {
    throw new Error(
      "Thiếu giá SJC hoặc giá vàng thế giới quy đổi"
    );
  }

  const premium = sjcPrice - worldPriceVnd;

  const premiumPercent =
    (premium / worldPriceVnd) * 100;

  return {
    premium: Math.round(premium),
    premiumPercent:
      Math.round(premiumPercent * 100) / 100,
  };
}

module.exports = {
  convertWorldGoldToVndPerLuong,
  calculatePremium,
};