const menu = [
  { id: 1, name: "Truffle Mushroom Pizza", category: "Pizza", price: 349, rating: "4.8", time: "25 min", tag: "Bestseller", description: "Roasted mushrooms, truffle cream & mozzarella.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "Double Smash Burger", category: "Burgers", price: 289, rating: "4.9", time: "20 min", tag: "Popular", description: "Two smashed patties, cheese, pickles & house sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Creamy Garlic Pasta", category: "Pasta", price: 269, rating: "4.7", time: "20 min", tag: "Chef's pick", description: "Silky parmesan sauce with roasted garlic.", image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=700&q=85" },
  { id: 4, name: "Berry Bliss Shake", category: "Drinks", price: 159, rating: "4.8", time: "10 min", tag: "New", description: "Strawberry, vanilla & a little extra joy.", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=85" },
  { id: 5, name: "Fiery Paneer Taco", category: "Mexican", price: 199, rating: "4.6", time: "18 min", tag: "Spicy", description: "Charred paneer, salsa fresca & lime crema.", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=85" },
  { id: 6, name: "Classic Veggie Pizza", category: "Pizza", price: 299, rating: "4.7", time: "25 min", tag: "Vegetarian", description: "Peppers, olives, corn & stretchy cheese.", image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=700&q=85" },
  { id: 7, name: "Crispy Chicken Burger", category: "Burgers", price: 259, rating: "4.7", time: "20 min", tag: "Hot pick", description: "Golden chicken, lettuce & pepper mayo.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=85" },
  { id: 8, name: "Choco Lava Cake", category: "Desserts", price: 149, rating: "4.9", time: "12 min", tag: "Sweetest", description: "Warm gooey chocolate centre, pure comfort.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85" }
];

const categories = [
  { name: "All", icon: "✦" }, { name: "Pizza", icon: "🍕" }, { name: "Burgers", icon: "🍔" }, { name: "Pasta", icon: "🍝" }, { name: "Mexican", icon: "🌮" }, { name: "Drinks", icon: "🥤" }, { name: "Desserts", icon: "🍰" }
];

let activeCategory = "All";
const { sanitizeCart, calculateCart, normalizeCoupon } = window.CraveCartLogic;
function readStoredJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || ""); } catch { return fallback; }
}
function readStoredText(key) {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}
let cart = sanitizeCart(readStoredJson("cravecart-cart", []), menu);
let appliedCoupon = normalizeCoupon(readStoredText("cravecart-coupon"));
let couponFeedback = "";
let couponFeedbackType = "";
let user = readStoredJson("cravecart-user", null);
let deliveryLocation = readStoredJson("cravecart-location", { country: "India", city: "Bengaluru", area: "Indiranagar" });
let orders = readStoredJson("cravecart-orders", []);
const categoryRow = document.getElementById("categoryRow");
const foodGrid = document.getElementById("foodGrid");
const foodSearch = document.getElementById("foodSearch");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const toast = document.getElementById("toast");
const cartTrigger = document.getElementById("cartTrigger");
const couponForm = document.getElementById("couponForm");
const couponInput = document.getElementById("couponInput");
const couponStatus = document.getElementById("couponStatus");
const couponApplied = document.getElementById("couponApplied");
const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");
const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");
const welcomeLayer = document.getElementById("welcomeLayer");
const welcomeForm = document.getElementById("welcomeForm");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");
const locationLayer = document.getElementById("locationLayer");
const locationForm = document.getElementById("locationForm");
const countrySelect = document.getElementById("countrySelect");
const citySelect = document.getElementById("citySelect");
const areaInput = document.getElementById("areaInput");
const ordersLayer = document.getElementById("ordersLayer");
const ordersContent = document.getElementById("ordersContent");
let toastTimer;

function money(value) { return `₹${Number(value || 0).toLocaleString("en-IN")}`; }
function saveUser() { try { localStorage.setItem("cravecart-user", JSON.stringify(user)); } catch {} }
function saveLocation() { try { localStorage.setItem("cravecart-location", JSON.stringify(deliveryLocation)); } catch {} }
function saveOrders() { try { localStorage.setItem("cravecart-orders", JSON.stringify(orders)); } catch {} }
function initials(name) { return name.trim().slice(0, 1).toUpperCase() || "F"; }
function validUser(value) { return value && typeof value.name === "string" && value.name.trim().length >= 2 && typeof value.phone === "string" && /^\d{10}$/.test(value.phone); }
function formatPhone(phone) { return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`; }
function renderUser() {
  const hasUser = validUser(user);
  welcomeLayer.hidden = hasUser;
  document.body.classList.toggle("welcome-open", !hasUser);
  if (!hasUser) return;
  const name = user.name.trim();
  document.getElementById("profileInitial").textContent = initials(name);
  document.getElementById("profileGreeting").textContent = `Hi, ${name.split(" ")[0]}`;
  document.getElementById("profileName").textContent = name;
  const phone = document.getElementById("profilePhone");
  phone.textContent = formatPhone(user.phone); phone.href = `tel:+91${user.phone}`;
}
const citiesByCountry = {
  India: ["Bengaluru", "Chennai", "Mumbai", "Delhi", "Hyderabad", "Pune"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Singapore: ["Singapore"],
  "United Kingdom": ["London", "Manchester", "Birmingham"]
};
function renderLocation() {
  const cities = citiesByCountry[deliveryLocation.country] || citiesByCountry.India;
  citySelect.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join("");
  if (cities.includes(deliveryLocation.city)) citySelect.value = deliveryLocation.city;
  areaInput.value = deliveryLocation.area || "";
  document.getElementById("locationLabel").textContent = `${deliveryLocation.area}, ${deliveryLocation.city}`;
}
function setLocationOpen(open) {
  locationLayer.hidden = !open;
  if (open) profileMenu.hidden = true;
  document.body.classList.toggle("location-open", open);
  if (open) { countrySelect.value = deliveryLocation.country; renderLocation(); areaInput.focus(); }
}
function renderOrders() {
  const ongoing = orders.filter(order => order.status === "ongoing");
  const past = orders.filter(order => order.status === "past");
  const orderMarkup = order => `<article class="order-card"><div><strong>Order #${order.id}</strong><small>${order.items} item${order.items === 1 ? "" : "s"} · ${money(order.total)}</small></div><span class="order-status ${order.status}">${order.status === "ongoing" ? "On the way" : "Delivered"}</span></article>`;
  const emptyGroup = message => `<p class="orders-group-empty">${message}</p>`;
  ordersContent.innerHTML = `<h3 class="orders-group-title">Ongoing</h3>${ongoing.length ? ongoing.map(orderMarkup).join("") : emptyGroup("No orders are being prepared right now.")}<h3 class="orders-group-title">Past orders</h3>${past.length ? past.map(orderMarkup).join("") : emptyGroup("Your delivered orders will show up here.")}`;
}
function setOrdersOpen(open) {
  ordersLayer.hidden = !open;
  profileMenu.hidden = true;
  if (open) renderOrders();
}
function setTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark-mode", dark);
  themeIcon.textContent = dark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  try { localStorage.setItem("cravecart-theme", dark ? "dark" : "light"); } catch {}
}

function renderCategories() {
  categoryRow.innerHTML = categories.map(category => `
    <button class="category ${category.name === activeCategory ? "active" : ""}" role="tab" aria-selected="${category.name === activeCategory}" data-category="${category.name}">
      <span class="category-icon">${category.icon}</span>${category.name}
    </button>`).join("");
}

function getVisibleMenu() {
  const query = foodSearch.value.trim().toLowerCase();
  return menu.filter(item => (activeCategory === "All" || item.category === activeCategory) && (`${item.name} ${item.description} ${item.category}`).toLowerCase().includes(query));
}

function renderFood() {
  const visibleMenu = getVisibleMenu();
  document.getElementById("resultCount").textContent = activeCategory === "All" && !foodSearch.value ? "Popular near you" : `${visibleMenu.length} delicious ${visibleMenu.length === 1 ? "option" : "options"}`;
  foodGrid.innerHTML = visibleMenu.length ? visibleMenu.map((item, index) => `
    <article class="food-card" style="animation-delay:${index * 55}ms">
      <div class="food-image" style="background-image:url('${item.image}')">
        <span class="tag">${item.tag}</span><button class="heart" data-heart="${item.id}" aria-label="Save ${item.name}">♡</button>
      </div>
      <div class="food-info">
        <div class="food-meta"><span class="rating">★ ${item.rating}</span><span>${item.time}</span></div>
        <h3 class="food-name">${item.name}</h3><p class="food-description">${item.description}</p>
        <div class="card-bottom"><strong class="price">${money(item.price)}</strong><button class="add-button" data-add="${item.id}" aria-label="Add ${item.name} to cart">+</button></div>
      </div>
    </article>`).join("") : `<div class="no-results"><h3>Nothing found yet.</h3><p>Try another craving.</p></div>`;
}

function saveCart() {
  try { localStorage.setItem("cravecart-cart", JSON.stringify(cart)); } catch { /* Private browsing can block storage; the cart still works for this visit. */ }
}
function saveCoupon() {
  try { localStorage.setItem("cravecart-coupon", appliedCoupon); } catch { /* See saveCart. */ }
}

function setCouponFeedback(message, type = "") {
  couponFeedback = message;
  couponFeedbackType = type;
}

function renderCoupon(totals) {
  const { promotion } = totals;
  const hasCoupon = Boolean(appliedCoupon && promotion.valid);
  couponApplied.hidden = !hasCoupon;
  document.getElementById("couponLabel").textContent = hasCoupon ? promotion.code : "";
  couponStatus.className = `coupon-status ${couponFeedbackType}`;
  if (couponFeedback) couponStatus.textContent = couponFeedback;
  else if (hasCoupon) couponStatus.textContent = `${promotion.name} saved you ${money(promotion.discount)}.`;
  else couponStatus.textContent = "";
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  let totals = calculateCart(cart, appliedCoupon);
  if (appliedCoupon && !totals.promotion.valid) {
    const missing = totals.promotion.minimum ? totals.promotion.minimum - totals.subtotal : 0;
    appliedCoupon = "";
    saveCoupon();
    setCouponFeedback(missing > 0 ? `Your basket needs ${money(missing)} more to keep that flavour key.` : "That flavour key is no longer available.", "error");
    totals = calculateCart(cart, "");
  }
  document.getElementById("cartCount").textContent = totalItems;
  cartEmpty.hidden = cart.length > 0;
  cartSummary.hidden = cart.length === 0;
  cartItems.innerHTML = cart.map(item => `<article class="cart-item">
      <div class="cart-image" style="background-image:url('${item.image}')"></div>
      <div><h3>${item.name}</h3><p>${money(item.price)}</p><div class="quantity"><button data-change="${item.id}" data-delta="-1" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button data-change="${item.id}" data-delta="1" aria-label="Increase ${item.name}">+</button></div></div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button>
    </article>`).join("");
  document.getElementById("subtotal").textContent = money(totals.subtotal);
  document.getElementById("discount").textContent = `−${money(totals.discount)}`;
  document.getElementById("discountRow").hidden = totals.discount === 0;
  document.getElementById("total").textContent = money(totals.total);
  renderCoupon(totals);
  saveCart();
}

function animateItemToCart(product, button) {
  const source = button.closest(".food-card")?.querySelector(".food-image");
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!source || prefersReducedMotion) return;
  const sourceBox = source.getBoundingClientRect();
  const cartBox = cartTrigger.getBoundingClientRect();
  const flyer = document.createElement("div");
  const size = Math.min(58, Math.max(42, sourceBox.width * .32));
  flyer.className = "cart-flyer";
  flyer.style.backgroundImage = `url("${product.image}")`;
  flyer.style.width = `${size}px`;
  flyer.style.height = `${size}px`;
  flyer.style.left = `${sourceBox.left + sourceBox.width / 2 - size / 2}px`;
  flyer.style.top = `${sourceBox.top + sourceBox.height / 2 - size / 2}px`;
  flyer.style.setProperty("--flight-x", `${cartBox.left + cartBox.width / 2 - sourceBox.left - sourceBox.width / 2}px`);
  flyer.style.setProperty("--flight-y", `${cartBox.top + cartBox.height / 2 - sourceBox.top - sourceBox.height / 2}px`);
  document.body.append(flyer);
  requestAnimationFrame(() => flyer.classList.add("is-flying"));
  flyer.addEventListener("animationend", () => flyer.remove(), { once: true });
  cartTrigger.classList.remove("cart-pop");
  void cartTrigger.offsetWidth;
  cartTrigger.classList.add("cart-pop");
  cartTrigger.addEventListener("animationend", () => cartTrigger.classList.remove("cart-pop"), { once: true });
}

function addToCart(id, button) {
  const product = menu.find(item => item.id === id);
  if (!product) return;
  const inCart = cart.find(item => item.id === id);
  if (inCart && inCart.quantity >= 99) { showToast("One dish at a time — 99 is the basket limit."); return; }
  if (inCart) inCart.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  animateItemToCart(product, button);
  renderCart(); showToast(`${product.name} is on its way to your cart`);
}
function changeQuantity(id, delta) {
  const item = cart.find(product => product.id === id); if (!item) return;
  if (delta > 0 && item.quantity >= 99) { showToast("One dish at a time — 99 is the basket limit."); return; }
  item.quantity += delta; if (item.quantity <= 0) cart = cart.filter(product => product.id !== id);
  renderCart();
}
function applyCoupon() {
  const code = normalizeCoupon(couponInput.value);
  const preview = calculateCart(cart, code);
  if (!code) {
    setCouponFeedback("Type a flavour key first.", "error");
  } else if (!preview.promotion.valid) {
    const message = preview.promotion.reason === "minimum"
      ? `This key wakes up at ${money(preview.promotion.minimum)}. Add ${money(preview.promotion.minimum - preview.subtotal)} more.`
      : "That flavour key is not on today’s menu.";
    setCouponFeedback(message, "error");
  } else {
    appliedCoupon = preview.promotion.code;
    couponInput.value = "";
    saveCoupon();
    setCouponFeedback(`${preview.promotion.name} is live — ${money(preview.discount)} tastes better in your pocket.`, "success");
    showToast(`${preview.promotion.code} applied — ${money(preview.discount)} saved`);
  }
  renderCart();
}
function showToast(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600); }
function setCartOpen(open) { cartDrawer.classList.toggle("open", open); document.getElementById("scrim").classList.toggle("visible", open); cartDrawer.setAttribute("aria-hidden", String(!open)); cartTrigger.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("cart-is-open", open); }

categoryRow.addEventListener("click", event => { const button = event.target.closest("[data-category]"); if (!button) return; activeCategory = button.dataset.category; renderCategories(); renderFood(); });
foodSearch.addEventListener("input", renderFood);
foodGrid.addEventListener("click", event => { const add = event.target.closest("[data-add]"); const heart = event.target.closest("[data-heart]"); if (add) addToCart(Number(add.dataset.add), add); if (heart) { heart.classList.toggle("active"); heart.textContent = heart.classList.contains("active") ? "♥" : "♡"; } });
cartItems.addEventListener("click", event => { const change = event.target.closest("[data-change]"); const remove = event.target.closest("[data-remove]"); if (change) changeQuantity(Number(change.dataset.change), Number(change.dataset.delta)); if (remove) { const product = cart.find(item => item.id === Number(remove.dataset.remove)); if (!product) return; cart = cart.filter(item => item.id !== product.id); renderCart(); showToast(`${product.name} removed from your cart`); } });
couponForm.addEventListener("submit", event => { event.preventDefault(); applyCoupon(); });
document.getElementById("removeCoupon").addEventListener("click", () => { appliedCoupon = ""; saveCoupon(); setCouponFeedback("Flavour key removed. The full feast total is back.", ""); renderCart(); });
cartTrigger.addEventListener("click", () => setCartOpen(true));
document.getElementById("closeCart").addEventListener("click", () => setCartOpen(false));
document.getElementById("scrim").addEventListener("click", () => setCartOpen(false));
document.getElementById("startOrdering").addEventListener("click", () => { setCartOpen(false); document.getElementById("menu").scrollIntoView(); });
document.getElementById("browseButton").addEventListener("click", () => document.getElementById("menu").scrollIntoView());
searchButton.addEventListener("click", () => {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => foodSearch.focus(), 450);
});
document.getElementById("viewAllButton").addEventListener("click", () => { activeCategory = "All"; foodSearch.value = ""; renderCategories(); renderFood(); });
document.getElementById("copyCode").addEventListener("click", async () => { try { await navigator.clipboard.writeText("CODEKRAFTERS"); showToast("Discount code copied: CODEKRAFTERS"); } catch { showToast("Use code: CODEKRAFTERS"); } });
document.getElementById("checkoutButton").addEventListener("click", () => {
  const totals = calculateCart(cart, appliedCoupon);
  if (!cart.length) return;
  orders.unshift({ id: String(Date.now()).slice(-6), items: cart.reduce((sum, item) => sum + item.quantity, 0), total: totals.total, status: "ongoing", createdAt: new Date().toISOString() });
  orders = orders.slice(0, 10);
  saveOrders();
  cart = []; appliedCoupon = ""; saveCoupon(); renderCart(); setCartOpen(false);
  showToast("We’re building the backend for checkout — good things take a little time.");
});
locationButton.addEventListener("click", () => setLocationOpen(true));
document.getElementById("closeLocation").addEventListener("click", () => setLocationOpen(false));
countrySelect.addEventListener("change", () => { deliveryLocation.country = countrySelect.value; deliveryLocation.city = (citiesByCountry[deliveryLocation.country] || [])[0]; renderLocation(); });
locationForm.addEventListener("submit", event => {
  event.preventDefault();
  const area = areaInput.value.trim().replace(/\s+/g, " ");
  if (area.length < 2) { document.getElementById("locationError").textContent = "Add an area or neighbourhood so your food knows where to go."; return; }
  deliveryLocation = { country: countrySelect.value, city: citySelect.value, area };
  saveLocation(); renderLocation(); setLocationOpen(false); showToast(`Delivery spot saved: ${area}, ${deliveryLocation.city}`);
});
document.getElementById("ordersButton").addEventListener("click", () => setOrdersOpen(true));
document.getElementById("profileLocationButton").addEventListener("click", () => setLocationOpen(true));
document.getElementById("closeOrders").addEventListener("click", () => setOrdersOpen(false));
themeButton.addEventListener("click", () => setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark"));
profileButton.addEventListener("click", () => { const open = profileMenu.hidden; profileMenu.hidden = !open; profileButton.setAttribute("aria-expanded", String(open)); });
document.getElementById("signOutButton").addEventListener("click", () => { user = null; try { localStorage.removeItem("cravecart-user"); } catch {} profileMenu.hidden = true; profileButton.setAttribute("aria-expanded", "false"); renderUser(); document.getElementById("welcomeName").focus(); });
welcomeForm.addEventListener("submit", event => { event.preventDefault(); const name = document.getElementById("welcomeName").value.trim().replace(/\s+/g, " "); const phone = document.getElementById("welcomePhone").value.replace(/\D/g, "").slice(-10); const error = document.getElementById("welcomeError"); if (name.length < 2) { error.textContent = "Please enter at least two letters for your name."; return; } if (phone.length !== 10) { error.textContent = "Please enter a valid 10-digit phone number."; return; } user = { name, phone }; saveUser(); error.textContent = ""; renderUser(); showToast(`Welcome to the table, ${name.split(" ")[0]}!`); });
document.addEventListener("click", event => { if (!event.target.closest(".profile-wrap")) { profileMenu.hidden = true; profileButton.setAttribute("aria-expanded", "false"); } });
document.addEventListener("keydown", event => { if (event.key === "Escape") { setCartOpen(false); setLocationOpen(false); setOrdersOpen(false); profileMenu.hidden = true; profileButton.setAttribute("aria-expanded", "false"); } });
setTheme(readStoredText("cravecart-theme") === "dark" ? "dark" : "light");
renderLocation(); renderUser(); renderCategories(); renderFood(); renderCart();
