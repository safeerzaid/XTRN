# Payment Phase Audit Report

### 1. Where I am now: one-paragraph summary + % complete per checklist item
The payment and checkout phase is currently partially implemented. The foundational frontend checkout UI and backend order creation logic exist, successfully handling Cash on Delivery (COD) orders with server-computed totals and client-side validation. However, the system is lacking critical e-commerce features: there is no inventory check/decrement, meaning unlimited purchases can be made; the Razorpay integration is incomplete (the package is installed, but no session is created and the frontend doesn't trigger the modal); and there are no webhooks or order confirmation emails configured. Furthermore, a stale-state bug in the client store can lead to failing orders. 
- (1) Checkout page: 85% (missing Razorpay payment selector and modal trigger)
- (2) Order model: 90% (missing `razorpaySignature` and `paidAt`)
- (3) POST /api/orders: 60% (missing stock decrement and Razorpay session creation)
- (4) Razorpay integration: 10% (package installed, missing implementation)
- (5) Payment verification webhook: 0%
- (6) Order confirmation email (SMTP): 10% (utility exists, not wired)

### 2. File map
| Path | What it does | Related checklist item | Status |
| :--- | :--- | :--- | :--- |
| `client/src/pages/CheckoutPage.jsx` | Frontend checkout UI & submission | 1. Checkout page | Done for COD, needs Razorpay logic |
| `client/src/store/cartStore.js` | Client-side Zustand cart state | 1. Checkout page | Done, but lacks sync triggers |
| `server/models/Order.js` | Mongoose schema for orders | 2. Order model | Partial |
| `server/routes/orderRoutes.js` | Express routes for order endpoints | 3. POST /api/orders | Done |
| `server/controllers/orderController.js` | Business logic for orders | 3. POST /api/orders | Partial (Missing stock check/Razorpay) |
| `server/package.json` | Server dependencies | 4. Razorpay integration | `razorpay` is installed |
| `server/server.js` | Express app entry point | 5. Webhook | Missing `express.raw` |
| `server/utils/sendEmail.js` | Nodemailer utility | 6. Email | Done for utility, missing wiring |
| `server/.env.example` | Environment variable template | 4, 6 | Missing Razorpay keys |

### 3. Checklist status

**1. Checkout page**
- **Status:** Partial
- **What exists:** Form state handling (`client/src/pages/CheckoutPage.jsx:25`), client-side validation (`client/src/pages/CheckoutPage.jsx:46`), loading states, and successfully posts COD payload.
- **What is missing:** Payment method selector and Razorpay modal integration.
- **Bugs/Risks:** The `CheckoutPage` does not fetch the cart on mount, leading to the cart sync bug detailed below. 

**2. Order model**
- **Status:** Partial
- **What exists:** `user`, `items`, `shippingAddress`, `totalAmount`, `status`, `paymentMethod`, `paymentStatus`, `razorpayOrderId`, `razorpayPaymentId`, timestamps (`server/models/Order.js`).
- **What is missing:** `razorpaySignature` and an explicit `paidAt` date.

**3. POST /api/orders**
- **Status:** Partial
- **What exists:** Auth checks, body validation, server-computed cart total (`server/controllers/orderController.js:41`), order creation, and cart clearing (`server/controllers/orderController.js:54`).
- **What is missing:** Stock checking and decrementing. Idempotency checks. Razorpay backend session generation.
- **Bugs/Risks:** Creating a `razorpay` paymentMethod order succeeds instantly without any gateway communication.

**4. Razorpay integration**
- **Status:** Partial (Barely Started)
- **What exists:** The `razorpay` package is installed (`server/package.json:28`). 
- **What is missing:** `.env.example` has no Razorpay keys. No config file exists. The frontend script is not included. The controller does not call `razorpay.orders.create()`.

**5. Payment verification webhook**
- **Status:** Not started
- **What exists:** Nothing.
- **What is missing:** Webhook route, `express.raw` parser in `server.js` before `express.json()`, HMAC signature verification.

**6. Order confirmation email**
- **Status:** Not started (wiring)
- **What exists:** `server/utils/sendEmail.js` uses Nodemailer and SMTP env vars.
- **What is missing:** A specific template/function for order confirmation and a call to it from the order controller or webhook.

### 4. Cart sync investigation
- **Where is the cart store defined?** `client/src/store/cartStore.js`. It holds `items` in memory. It only syncs with the server when explicitly told to (e.g. `fetchCart()`, `addItem()`, etc.).
- **Does CheckoutPage fetch the cart on mount?** No. It only calls `const { items, getTotalPrice, fetchCart } = useCartStore();` (`client/src/pages/CheckoutPage.jsx:15`) but never runs `fetchCart()` in a `useEffect`.
- **Step-by-step failure walkthrough:**
  1. User adds items to the cart in the browser. Store `items` updates.
  2. User successfully places an order via Postman. The server clears the cart in DB.
  3. The browser tab is still open. The `cartStore` in memory still contains the old items (it hasn't been re-fetched).
  4. User goes to checkout in the browser. `CheckoutPage` reads the stale memory items and displays them.
  5. User submits the checkout form. `POST /api/orders` runs, fetches the DB cart, finds `cart.items.length === 0`, and throws the 400 "Cart is empty" error.
- **Other sync risks:** Yes, two open tabs, multiple devices, or an admin deleting cart items will cause the client state to silently go out of sync.
- **Will adding `fetchCart()` to CheckoutPage mount fix this?** Yes, it will prevent the user from checking out with an empty cart. However, the global `Navbar` cart icon and `CartPage` could still suffer from staleness if the user switches tabs. 

### 5. Detailed checks
**Checkout page:**
- Form validation? **Yes** (client-side in `CheckoutPage.jsx:46`).
- Payment method selector? **No** (hardcoded to COD).
- Loading/error states? **Yes**.

**Order model:**
- Fields present: user, items, shippingAddress, totalAmount, status, paymentMethod, paymentStatus, razorpayOrderId, razorpayPaymentId.
- Fields missing: razorpaySignature, paidAt.

**POST /api/orders:**
- Server-computed total? **Yes** (`orderController.js:41`).
- Stock checked/decremented? **No**.
- Cart cleared and when? **Yes**, immediately after creating the order, before the response (`orderController.js:54`).
- Can a "razorpay" order be created without any payment call? **Yes**.

**Razorpay:**
- Package installed? **Yes** (`server/package.json:28`).
- Config file? **No**.
- Env vars? **No** (missing in `.env.example`).
- Frontend script/modal? **No**.

**Verification/webhook:**
- Endpoints exist? **No**.
- HMAC check? **No**.
- express.raw mounted before express.json()? **No** (`server/server.js:24` only has `express.json()`).
- Idempotent? **No**.

**Email:**
- Current library/service: **Nodemailer** (`server/utils/sendEmail.js`).
- SMTP env vars: **Yes** (`GMAIL_USER`, `EMAIL_FROM`, `EMAIL_APP_PASSWORD`).
- Confirmation function exists and is called? **No**.
- Does a failure ever block the order response? **N/A** (not implemented yet).

### 6. Bugs and risks, ranked
1. **CRITICAL - No Stock Decrement:** `server/controllers/orderController.js` does not check or decrement product stock. Users can buy unlimited quantities, leading to overselling.
2. **HIGH - Razorpay Bypass:** Submitting `paymentMethod: 'razorpay'` creates a valid order instantly without calling the payment gateway.
3. **HIGH - Cart Sync Bug:** `CheckoutPage.jsx` does not fetch cart data on mount, allowing users to attempt checkouts with stale client data that conflicts with the server.
4. **MEDIUM - No Idempotency:** Double-clicking the submit button on `CheckoutPage.jsx` could potentially fire two concurrent requests before the first one clears the cart, creating duplicate orders.

### 7. What to do next
1. **Fix Cart Sync on Checkout (Small):**
   - Goal: Add `useEffect` in `CheckoutPage.jsx` to call `fetchCart()` on mount.
   - Files: `client/src/pages/CheckoutPage.jsx`
   - Dependencies: None.
2. **Implement Stock Checks (Medium):**
   - Goal: Check stock against order quantity and atomicly decrement it during order creation.
   - Files: `server/controllers/orderController.js`
   - Dependencies: None.
3. **Razorpay Backend Setup (Medium):**
   - Goal: Add env keys, create a config file, and update `createOrder` to conditionally call `razorpay.orders.create` if method is razorpay, returning the ID instead of completing the order.
   - Files: `server/.env`, `server/.env.example`, `server/config/razorpay.js`, `server/controllers/orderController.js`, `server/models/Order.js` (add signature/paidAt).
   - Dependencies: None.
4. **Razorpay Frontend Modal (Medium):**
   - Goal: Integrate Razorpay script in index.html, add a payment selector in `CheckoutPage`, and trigger the modal on backend session success.
   - Files: `client/src/pages/CheckoutPage.jsx`, `client/index.html`.
   - Dependencies: Step 3.
5. **Webhook & Verification (Large):**
   - Goal: Add `express.raw` parser in `server.js` before `express.json()`. Create webhook endpoint to verify HMAC signature and mark order as paid.
   - Files: `server/server.js`, `server/routes/orderRoutes.js`, `server/controllers/orderController.js`.
   - Dependencies: Step 3.
6. **Order Emails (Small):**
   - Goal: Create an order email template and trigger it securely.
   - Files: `server/utils/sendEmail.js`, `server/controllers/orderController.js`.
   - Dependencies: None.

### 8. Manual test plan
- **Cart Sync Regression Test:** Add item to cart in browser. In Postman, hit POST `/api/orders` to clear the cart on the server. In the browser, navigate to the checkout page (do not refresh the page manually). Confirm the checkout page now shows "Your cart is empty" instead of the stale items.
- **COD Success:** Place COD order, verify order in DB, verify stock decrements, verify cart clears.
- **Razorpay Cancel:** Initiate Razorpay, close modal. Verify order status remains pending.
- **Razorpay Success:** Complete test payment. Verify webhook receives event, verifies signature, updates status to paid, and sets `paidAt`.
- **Email Test:** Verify confirmation email arrives in inbox with correct total for both COD and paid Razorpay orders.

### 9. Open questions
- **Idempotency:** Do we want to implement a true idempotency key for the `POST /api/orders` route to prevent duplicate orders if a user double-clicks?
- **Cart sync:** Do we want to add polling or WebSockets to keep the cart store in sync across multiple tabs, or is fetching on component mount sufficient for now?

---
### Previous audit
*See git history for the previous version of this document.*
