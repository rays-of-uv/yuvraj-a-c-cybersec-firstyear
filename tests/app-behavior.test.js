const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const logic = require("../cart-logic.js");

class FakeElement {
  constructor(id) {
    this.id = id;
    this.innerHTML = "";
    this.hidden = false;
    this.value = "";
    this.textContent = "";
    this.className = "";
    this.listeners = {};
    this.style = { setProperty() {} };
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  setAttribute() {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 40, height: 40 }; }
  append() {}
}

const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id, new FakeElement(id));
  return elements.get(id);
};
let flyingDish;
const fakeDocument = {
  body: new FakeElement("body"),
  getElementById: element,
  createElement: () => { flyingDish = new FakeElement("generated"); return flyingDish; },
  addEventListener() {}
};
const storage = new Map([["cravecart-cart", "{ deliberately broken JSON"]]);
const sandbox = {
  console,
  document: fakeDocument,
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)) },
  window: { CraveCartLogic: logic, matchMedia: () => ({ matches: false }) },
  navigator: { clipboard: { writeText: async () => {} } },
  setTimeout: () => 1,
  clearTimeout() {},
  requestAnimationFrame: callback => callback(),
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(require.resolve("../app.js"), "utf8"), sandbox);

assert.equal(element("cartCount").textContent, 0, "corrupt saved cart data must not stop the app from loading");
const sourceImage = new FakeElement("source-image");
sourceImage.getBoundingClientRect = () => ({ left: 32, top: 68, width: 180, height: 120 });
const addButton = {
  dataset: { add: "1" },
  closest: selector => selector === "[data-add]" ? addButton : selector === ".food-card" ? { querySelector: () => sourceImage } : null
};
element("foodGrid").listeners.click({ target: addButton });
assert.equal(element("cartCount").textContent, 1, "a menu add button must update the cart");
assert.equal(flyingDish.className, "cart-flyer", "adding an item must create an image flyer");
assert.match(flyingDish.style.backgroundImage, /images\.unsplash\.com/, "the flyer must use the selected dish image");

element("couponInput").value = " code krafters ";
element("couponForm").listeners.submit({ preventDefault() {} });
assert.equal(element("discount").textContent, "−₹120", "a valid coupon must update the checkout discount");
assert.equal(element("total").textContent, "₹229", "coupon discount must reduce the payable total");

element("removeCoupon").listeners.click();
assert.equal(element("total").textContent, "₹349", "removing a coupon must restore the full total");
console.log("✓ Runtime behavior test passed (bad storage, add-to-cart, apply/remove coupon)");
