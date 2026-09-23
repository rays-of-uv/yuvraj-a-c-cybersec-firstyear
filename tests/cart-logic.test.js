const assert = require("node:assert/strict");
const { sanitizeCart, evaluateCoupon, calculateCart, normalizeCoupon } = require("../cart-logic.js");

const products = [
  { id: 1, name: "Pizza", price: 349 },
  { id: 2, name: "Shake", price: 159 }
];

// Attack the storage boundary: wrong shapes, fake products, bad quantities and duplicates.
assert.deepEqual(sanitizeCart("not-an-array", products), []);
assert.deepEqual(sanitizeCart([{ id: 99, quantity: 2 }, { id: 1, quantity: 0 }, { id: 2, quantity: "nope" }], products), []);
const cleaned = sanitizeCart([{ id: 1, quantity: 2 }, { id: "1", quantity: 98 }, { id: 2, quantity: 1 }], products);
assert.equal(cleaned.length, 2);
assert.equal(cleaned.find(item => item.id === 1).quantity, 99, "duplicate quantities must cap at 99");

// Coupon input is normalized, rejects invalid codes, honours its minimum and caps the saving.
assert.equal(normalizeCoupon(" code krafters "), "CODEKRAFTERS");
assert.equal(evaluateCoupon("FAKE", 500).reason, "unknown");
assert.equal(evaluateCoupon("CODEKRAFTERS", 298).reason, "minimum");
assert.equal(evaluateCoupon("CODEKRAFTERS", 1000).discount, 120, "40% saving must never exceed its cap");

const checkout = calculateCart([{ ...products[0], quantity: 1 }, { ...products[1], quantity: 1 }], "CODEKRAFTERS");
assert.equal(checkout.subtotal, 508);
assert.equal(checkout.discount, 120);
assert.equal(checkout.total, 388);
assert.ok(checkout.total >= 0, "a coupon must never produce a negative total");

console.log("✓ Cart hardening tests passed (storage, coupon, totals)");
