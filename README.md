# CraveCart — Food Ordering Interface

A responsive, frontend-only food ordering experience created for the CodeKrafters SRM 2026 Web Development Challenge — **1st Year, Task 2**.

[Run the live project online](https://rays-of-uv.github.io/yuvraj-a-c-cybersec-firstyear/)

## What it demonstrates

- Restaurant-style landing banner and clear food-category browsing
- Searchable food cards with image, name, price, description, rating, and delivery time
- Add-to-cart, quantity controls, removal, running totals, and persistent cart state
- A dish-image “flight” animation from a food card into the cart
- A warm editorial/neumorphic visual system with animated light/dark mode transitions
- Responsive motion, hover states, onboarding, cart drawer, and reduced-motion support
- Coupon validation using `CODEKRAFTERS` (40% off, maximum ₹120, valid above ₹299)
- Responsive desktop and mobile layouts, keyboard-friendly controls, visible focus states, and reduced-motion support
- Custom delivery location selection with country, city, and area
- Profile order history with ongoing and past-order sections
- Checkout flow that places an order into Ongoing orders, with delivery confirmation to move it into Past orders
- Order cancellation flow with a transparent 50% next-order charge to discourage food waste

## Run locally

No install step is needed.

1. Download or clone this folder.
2. Open `index.html` in a modern browser.
3. Add food, open the cart, and try `CODEKRAFTERS` at checkout.

## Project structure

```text
index.html       Page structure
styles.css       Responsive styling and animations
app.js           Browser interactions and rendering
cart-logic.js    Testable cart/coupon business logic
assets           Project-owned visuals
tests            Self-tests for cart logic and page behaviour
```

## Demo checklist

For a 60-second submission demo: show the responsive homepage, change a category, search a dish, add it to cart, show the image flying to the cart, apply `CODEKRAFTERS`, update a quantity, and remove the coupon.

## Scope

This is intentionally a frontend-only project: payment, login, database, and backend integration are outside the first-year Task 2 requirement.
