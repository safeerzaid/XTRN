# XTRN E-Commerce - Complete Audit Report

## 1. Executive Summary
**Overall Completion Estimate:** 85%
**Launch-Readiness Verdict:** Almost Ready

**Top 5 Reasons for Verdict:**
1. **Late Payment Edge Case:** Webhooks do not handle late payments for cancelled orders (cron cancels them after 30 mins). A user could pay after 30 minutes, get charged, but the order remains cancelled and stock is not re-allocated.
2. **CORS & Cookie Proxy Issues:** Production deployment will fail because CORS origins are hardcoded to `localhost` in `server.js`, and Express lacks `trust proxy` (required for Secure cookies on Render/Heroku).
3. **Admin Edit Product Bug:** The edit product modal fails with a 400 error if `originalPrice` is empty, because it sends a string (`""`) which fails Zod's `z.number()` validation.
4. **Mass Assignment Vulnerability:** The `updateProduct` controller validates with Zod but passes `req.body` directly to `findByIdAndUpdate`, allowing potential injection of unvalidated fields.
5. **Currency Formatting Bugs:** The admin panel hardcodes `$` for prices instead of using the standard `formatPrice` utility (₹).

---

## 2. Project Map
### Folder Structure
- `client/src/`: React frontend (Pages, Components, Context, Store, Utils).
- `server/`: Express backend (Controllers, Models, Routes, Middleware, Jobs, Config, Validators).

### Routes & Middleware
- **Auth** (`/api/auth`): `/signup`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`, `/resend-verification`. (Rate limiters applied).
- **Products** (`/api/products`): `GET /` (filters), `GET /search`, `GET /:id`, `POST /` (Admin), `PUT /:id` (Admin), `DELETE /:id` (Admin).
- **Orders** (`/api/orders`): `GET /` (Auth), `GET /:id` (Auth), `POST /` (Auth), `POST /verify-payment` (Auth), `GET /admin` (Admin), `PATCH /admin/:id/status` (Admin).
- **Cart** (`/api/cart`): `GET /`, `POST /`, `PATCH /:itemId`, `DELETE /:itemId` (All Auth).
- **Wishlist** (`/api/wishlist`): standard CRUD (Auth).
- **Payments** (`/api/payments`): `POST /webhook` (Raw body).

### Models
`Product`, `User`, `Order`, `Cart`, `Wishlist`.

### Environment Variables (`.env`)
`MONGO_URI`, `PORT`, `NODE_ENV`, `FRONTEND_URL`, `CLIENT_URL`, `JWT_SECRET`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `EMAIL_FROM`, `GMAIL_USER`, `EMAIL_APP_PASSWORD`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

---

## 3. Feature Status Table

| Feature | Verdict | Evidence | What is missing |
| :--- | :--- | :--- | :--- |
| **Auth** | DONE | `authController.js`, `authRoutes.js` | fully implemented including roles, verification, and refresh tokens. |
| **Products** | DONE | `productRoutes.js`, `ProductListingPage.jsx` | Full listing, filters, search, and admin management exist. |
| **Cart** | DONE | `cartController.js`, `CartPage.jsx` | Quantity updates, removal, and post-order clearing implemented. |
| **Wishlist** | DONE | `wishlistRoutes.js`, `WishlistContext.jsx` | Fully working. |
| **Checkout** | DONE | `CheckoutPage.jsx`, `orderController.js` | Address, Razorpay, COD, and atomic stock checks are present. |
| **Orders** | DONE | `orderController.js`, `AdminOrders.jsx` | History, tracking, and status updates present. |
| **Payments** | PARTIAL | `paymentController.js` | Webhook verification works, but late payments on cancelled orders do not trigger refunds or status reversals. |
| **Cron** | PARTIAL | `cancelStaleOrders.js` | Works for a single instance. Will cause duplicate executions if the server is scaled horizontally. |
| **Emails** | DONE | `authController.js`, `orderEmail.js` | Order confirmations and auth emails are sent. |
| **Admin Panel**| PARTIAL | `AdminProducts.jsx` | "Edit Product" bug causes 400 Bad Request if `originalPrice` is empty. |
| **Community** | PARTIAL | `CommunityPage.jsx` | Frontend page exists, but no backend dynamic functionality observed. |
| **Profile** | DONE | `Profile.jsx` | Address, orders, wishlist all correctly linked. |

---

## 4. Findings Table

| ID | Severity | Area | File:Line | Problem | Suggested Fix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | High | Payments | `paymentController.js:53` | Late payments on orders cancelled by cron log a warning but don't refund the user. | Add Razorpay refund API call when `order` is not found but payment is captured. |
| 2 | High | Deploy | `server.js:22` | Hardcoded `localhost` CORS config. | Use `process.env.CLIENT_URL` for CORS origins. |
| 3 | High | Deploy | `server.js:25` | Missing `trust proxy` for secure cookies on PaaS (Render/Heroku). | Add `app.set('trust proxy', 1)` before cookie middleware. |
| 4 | Medium | Security | `productController.js:12` | Mass assignment risk: uses `req.body` directly instead of Zod's `result.data`. | Change `req.body` to `result.data` in `findByIdAndUpdate`. |
| 5 | Medium | Cron | `cancelStaleOrders.js:6` | Cron runs in-memory. Unsafe for multi-instance deployments. | Document limitation in README, or migrate to Agenda/Redis. |
| 6 | Medium | Security | `package.json` | 5 High severity vulnerabilities in `braces`, `nodemailer`, `brace-expansion`. | Run `npm audit fix`. |
| 7 | Medium | DB | `Product.js:53` | Missing indexes on `category`, `gender`, and no text index. | Add `index: true` to heavily filtered fields and a text index for search. |
| 8 | Low | Frontend | `AdminProducts.jsx:90` | Hardcoded `$` currency symbol. | Use `formatPrice` utility to display `₹`. |

---

## 5. Bugs and Edge Cases Found

### Bug 1: Admin Product Edit "Does Nothing" (400 Bad Request)
**Steps to reproduce:**
1. Go to Admin Products and click "Edit" on a product that has no `originalPrice` (or clear the field).
2. Click "Save Product".
3. **Result:** The UI shows "Invalid product data".
**Cause:** `ProductFormModal.jsx` initializes empty `originalPrice` to `""`. Zod validates `originalPrice` strictly as `z.number()`. `""` is passed to the backend, failing validation.

### Edge Case 1: Race Condition (Webhook vs Cron)
If a user takes exactly 30 minutes to pay, the cron job might cancel the order right as the webhook fires. `paymentController.js` logs a warning but keeps the money. The user receives no email, and the stock is restored.

### Edge Case 2: Inefficient Search
`Product.find()` in `productRoutes.js` uses a Regex `$or` search on multiple fields. Without a Text Index, this forces a full collection scan which will severely impact database performance as the catalog grows.

---

## 6. Prioritized Fix List

**P0 (Must fix before deploy)**
1. Fix Admin Product Edit bug (Handle empty strings in `originalPrice`).
2. Update CORS configuration in `server.js` to accept production URLs.
3. Add `trust proxy` to Express to ensure secure cookies work over HTTPS on deployed environments.

**P1 (Should fix)**
4. Implement automatic Razorpay refunds for late payments on cancelled orders in the webhook.
5. Fix mass-assignment vulnerability in `productController.js` by using `result.data`.
6. Fix hardcoded `$` symbols in Admin tables.
7. Run `npm audit fix` to patch high-severity vulnerabilities.

**P2 (Nice to have)**
8. Add MongoDB Text Index for efficient product searching.
9. Migrate Cron job to a resilient queue (e.g., BullMQ) if scaling to multiple server instances.

---

## 7. Prompts for Top 5 Fixes

You can copy and paste these directly back into the chat one at a time:

1. **Admin Product Edit Bug:**
   > "Fix the bug in `client/src/components/admin/ProductFormModal.jsx` where an empty `originalPrice` causes a 400 error. Ensure empty number fields are sent as `undefined` or `null` instead of empty strings."

2. **CORS and Trust Proxy:**
   > "Update `server/server.js` to use `process.env.CLIENT_URL` and `process.env.FRONTEND_URL` in the CORS origin array. Also, add `app.set('trust proxy', 1)` so secure cookies work correctly in production."

3. **Late Payment Refund Webhook:**
   > "In `server/controllers/paymentController.js`, update the `payment.captured` webhook event. If the order was already cancelled (not pending), automatically issue a refund using the Razorpay API and send an email notifying the user that their late payment was refunded."

4. **Mass Assignment in Products:**
   > "In `server/controllers/productController.js`, update the `updateProduct` and `createProduct` functions to use the validated `result.data` from Zod instead of passing `req.body` directly to the database."

5. **Admin Currency Symbol Fix:**
   > "In `client/src/pages/admin/AdminProducts.jsx` and `client/src/pages/admin/AdminOrders.jsx`, replace the hardcoded `$` symbol with the `formatPrice` utility function so prices display correctly in INR (₹)."

---

## 8. Testing Checklist
No automated tests are present. 
**Top 5 Flows to test manually:**
- [ ] **Payment Webhook:** Complete an order, close the Razorpay window, then capture the payment manually via Razorpay Dashboard to ensure the webhook marks it paid.
- [ ] **Stock Atomic Decrement:** Open two incognito tabs, add the last item in stock to both carts, and try checking out simultaneously. One should fail.
- [ ] **Auth Guards:** Try accessing `/api/orders/admin` and `/api/products` (POST) with a standard user token. Ensure a 403 response.
- [ ] **Price Calculation:** Manipulate the cart price in LocalStorage/React DevTools and submit the order. Verify the backend recalculates the correct price.
- [ ] **Cron Cancellation:** Create a pending Razorpay order, wait 35 minutes, and verify the order is cancelled and stock is restored.
