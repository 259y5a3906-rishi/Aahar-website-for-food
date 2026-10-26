# Aahar RNS (lean demo)
Static frontend, no build step. Open `index.html`, or run `python3 -m http.server 8000` and visit http://localhost:8000.
Implemented: home, shop (search/filters/sort), product, cart (localStorage), demo checkout with validation, rule-based nutrition assistant, favorites.
Not implemented: login/profile/orders pages, seller & admin dashboards, Express backend, real payments or AI API. `database/schema.sql` is a starter only.
All products, prices, nutrition and ratings are SAMPLE data. No payments occur. Product images are colored placeholders.
To add a real AI later: expose `/api/recommendations` on a backend holding the key, and call it from `recommend()` in `js/app.js`.
