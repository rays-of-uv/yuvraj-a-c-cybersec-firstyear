(function (root, factory) {
  const logic = factory();
  if (typeof module === "object" && module.exports) module.exports = logic;
  if (root) root.CraveCartLogic = logic;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const coupons = {
    CODEKRAFTERS: { name: "Krafter’s 40%", percent: 40, minOrder: 299, maxDiscount: 120 }
  };

  function normalizeCoupon(value) {
    const compact = typeof value === "string" ? value.trim().toUpperCase().replace(/[\s-]+/g, "") : "";
    return compact;
  }

  function sanitizeCart(savedCart, products) {
    if (!Array.isArray(savedCart) || !Array.isArray(products)) return [];
    const productsById = new Map(products.map(product => [Number(product.id), product]));
    const merged = new Map();
    savedCart.forEach(item => {
      const product = productsById.get(Number(item && item.id));
      const quantity = Math.floor(Number(item && item.quantity));
      if (!product || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) return;
      const current = merged.get(product.id) || 0;
      merged.set(product.id, Math.min(current + quantity, 99));
    });
    return [...merged.entries()].map(([id, quantity]) => ({ ...productsById.get(id), quantity }));
  }

  function evaluateCoupon(value, subtotal) {
    const code = normalizeCoupon(value);
    if (!code) return { code: "", valid: false, discount: 0, reason: "empty" };
    const coupon = coupons[code];
    if (!coupon) return { code, valid: false, discount: 0, reason: "unknown" };
    if (subtotal < coupon.minOrder) return { code, valid: false, discount: 0, reason: "minimum", minimum: coupon.minOrder };
    return {
      code,
      valid: true,
      name: coupon.name,
      discount: Math.min(Math.floor(subtotal * coupon.percent / 100), coupon.maxDiscount),
      reason: "applied"
    };
  }

  function calculateCart(cart, coupon) {
    const subtotal = (Array.isArray(cart) ? cart : []).reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    const promotion = evaluateCoupon(coupon, subtotal);
    return { subtotal, discount: promotion.discount, total: Math.max(0, subtotal - promotion.discount), promotion };
  }

  return { normalizeCoupon, sanitizeCart, evaluateCoupon, calculateCart };
});
