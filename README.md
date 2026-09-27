# CraveCart — Food Ordering Interface

A responsive, frontend-only food ordering experience created for the Web Development — **1st Year**.

[Run the live project online](https://rays-of-uv.github.io/yuvraj-a-c-cybersec-firstyear/)

## What it demonstrates

- Restaurant-style landing banner and clear food-category browsing
- Searchable food cards with image, name, price, description, rating, and delivery time
- Add-to-cart, quantity controls, removal, running totals, and persistent cart state
- A dish-image “flight” animation from a food card into the cart
- A warm editorial/neumorphic visual system with animated light/dark mode transitions
- Responsive motion, hover states, onboarding, cart drawer, and reduced-motion support
- Responsive desktop and mobile layouts, keyboard-friendly controls, visible focus states, and reduced-motion support
- Custom delivery location selection with country, city, and area
- Profile order history with ongoing and past-order sections
- Checkout flow that places an order into Ongoing orders, with delivery confirmation to move it into Past orders
- Order cancellation flow with a transparent 50% next-order charge to discourage food waste

## Run locally

No install step is needed.

1. Download or clone this folder.
2. Open `index.html` in a modern browser.

## Project structure

```text
index.html       Page structure
styles.css       Responsive styling and animations
app.js           Browser interactions and rendering
cart-logic.js    Testable cart/coupon business logic
assets           Project-owned visuals
tests            Self-tests for cart logic and page behaviour
```

## Scope

This is intentionally a frontend-only project: payment, login, database, and backend integration aren't available yet.
