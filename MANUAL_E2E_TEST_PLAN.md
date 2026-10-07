# XTRN E-Commerce - Manual End-to-End Test Plan

This document contains complete user journeys covering the entire XTRN application based on its current codebase behavior.

## Section 0: Setup and tools

**Run Order & Environment:**
1. **Database:** MongoDB running (local or Atlas) with standard `isVerified` and `role` fields available in Compass.
2. **Backend:** In `server/`, ensure `.env` matches `.env.example` (add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `GMAIL_USER`, `EMAIL_APP_PASSWORD`). Run `npm run dev` (starts nodemon on port 3000).
3. **Frontend:** In `client/`, ensure `.env` matches `.env.example` (contains `VITE_API_URL=http://localhost:3000/api` and `VITE_RAZORPAY_KEY_ID`). Run `npm run dev` (starts Vite on port 5173).
4. **Ngrok & Webhooks:** Run `ngrok http 3000` to expose the backend.
   - Go to Razorpay Dashboard -> Webhooks.
   - Set URL to `https://<ngrok-url>/api/payments/webhook`.
   - Add Secret matching `RAZORPAY_WEBHOOK_SECRET`.
   - Subscribe to events: `payment.captured` and `payment.failed`.
   - Open Ngrok inspector at `http://127.0.0.1:4040` to monitor incoming requests.

**Razorpay Test Details:**
- *Success Card:* Any Visa test card (e.g., 4111 1111 1111 1111), Future Expiry, CVV 111.
- *Failure Card:* Use Razorpay's designated failure test card or fail via UPI simulator in test mode.

**Data Setup (via MongoDB Compass):**
- **Admin:** Signup normally, then open Compass, locate the user in `users` collection, and change `role: "user"` to `role: "admin"`.
- **Verified Customer:** Signup normally, verify via email link, or change `isVerified: true` in Compass.
- **Unverified Customer:** Signup normally, do not click the email link (`isVerified: false`).
- **Products:** Login as Admin, go to Admin Dashboard -> Add Product.
  - Create Product A: Single size (e.g., "M"), stock 10.
  - Create Product B: Multiple sizes (e.g., "S", "M", "L"), stock 20.
  - Create Product C: Out of stock (stock 0).
  - Create Product D: Stock exactly 1.
  - Create Product E: `originalPrice` greater than `price` (e.g., Price 1000, Original Price 1500).
  - Create Product F: No `originalPrice` (leave blank).

**Testing Tools:**
- Browsers: Chrome (Primary), Firefox/Edge/Incognito (for race conditions and logged-out state).
- Ngrok inspector (`127.0.0.1:4040`).
- DB Monitoring: Keep MongoDB Compass open to track `stock` in `products` and `status`/`paymentStatus` in `orders`.
- **Cron Threshold Override:** In `server/jobs/cancelStaleOrders.js`, change `30 * 60 * 1000` to `1 * 60 * 1000` (1 minute) temporarily for J9. **RESTORE to 30 after testing.**

---

## Journeys

### J1: Guest browsing
- **Goal:** Verify catalog exploration without logging in.
- **Actor:** Guest
- **Priority:** P0
- **Preconditions:** Server and client running, seeded products exist.
- **Steps:**
  1. Open homepage (`/`). UI shows hero, sections, footer. Nav shows Men, Women, etc.
  2. Click 'Men' in Navbar. UI navigates to `/men`. DB: `GET /api/products?gender=Men` returns 200.
  3. Change Filters: Price 0-1000. Apply. UI updates to matched products. `GET /api/products?gender=Men&minPrice=0&maxPrice=1000` 200.
  4. Change Sorting to Price: High-Low. UI reorders.
  5. Search for "shoe". UI shows results for shoe. `GET /api/products/search?q=shoe` 200.
  6. Search for `s!h%o$e` and a 200-character string. UI shows "No results found". Safe DB response.
  7. Click a product with a discount (Product E). UI shows image, sizes, discount % (`((orig - price) / orig * 100)`), price formatting `₹1,000`. Hover zooms image on desktop. URL is `/product/:id`.
  8. Click 'Back' in browser. Returns to filtered `/men` list.
  9. Change to a long page, scroll down, click a product. Window scrolls to top (Y=0).
  10. Manually enter URL `/invalid-page`. UI shows 404 Not Found page.
  11. Click Footer links (Terms, About, Contact). Pages load correctly.
- **What can go wrong:** RegEx search crashes server on special characters, pagination exceeds available data, hover zoom triggers on mobile touch screens.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J2: New customer signup and auth flow
- **Goal:** Complete signup, test the verification gate, and session management.
- **Actor:** Guest -> Customer
- **Priority:** P0
- **Preconditions:** MongoDB and Email service (Nodemailer) working.
- **Steps:**
  1. Click Login -> Join our family (Signup).
  2. Enter "A", "invalid-email", "pass". Validation blocks form submission (HTML5/Zod).
  3. Enter "Test User", "test@test.com", "Password123". Click Signup.
  4. UI shows "Welcome! Your account is ready." No redirect to logged-in state. URL stays on signup/login. `POST /api/auth/signup` returns 201. DB: User created with `isVerified: false`. Email: Verification email sent to `test@test.com` with subject "Verify your email - XTRN Store".
  5. Go to Login. Enter "test@test.com" and "Password123".
  6. UI shows "Please verify your email before logging in" and a "Resend verification email" button. `POST /api/auth/login` returns 403.
  7. Click "Resend verification email". UI shows "Verification email sent!". `POST /api/auth/resend-verification` 200. Email arrives.
  8. Open the verification link from the email. URL `/verify-email/:token`. UI shows success. `POST /api/auth/verify-email/:token` 200. DB: `isVerified: true`.
  9. Reuse the same link. UI shows error "Invalid or expired". `POST` 400.
  10. Login with credentials. UI closes modal. Navbar shows Profile icon. `POST /api/auth/login` 200. Cookie `refreshToken` set.
  11. Refresh the page. Session persists via `POST /api/auth/refresh` 200.
  12. Click Logout. UI shows Login button again. `POST /api/auth/logout` 200. Cookie cleared.
- **What can go wrong:** Unverified user receives an access token anyway, verification link breaks frontend routing, email fails to send but user is stuck.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J3: Forgot and reset password
- **Goal:** Regain account access.
- **Actor:** Customer
- **Priority:** P1
- **Preconditions:** Registered user `test@test.com`.
- **Steps:**
  1. Click Login -> Forgot password.
  2. Enter `test@test.com`. UI shows success message. `POST /api/auth/forgot-password` 200. Email arrives with reset link.
  3. Click link. URL `/reset-password/:token`.
  4. Enter "NewPass123!". UI shows success. `POST /api/auth/reset-password/:token` 200. DB: Password hashed, tokens cleared.
  5. Attempt login with old password. 401 Invalid credentials.
  6. Attempt login with "NewPass123!". Success 200.
  7. Try reusing the reset link. 400 Invalid or expired token.
  8. Rate limit test: rapidly submit forgot password 20 times. 429 Too Many Requests.
- **What can go wrong:** Resetting password doesn't invalidate existing refresh tokens.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J4: Guest actions
- **Goal:** Verify protections for cart/wishlist.
- **Actor:** Guest
- **Priority:** P2
- **Preconditions:** Logged out.
- **Steps:**
  1. Go to a product page. Click "Add to Cart".
  2. UI redirects to or pops up Login. No item is added.
  3. Click "Wishlist" icon. Redirects to Login.
  4. Log in successfully.
  5. State does NOT retroactively add the item (system currently discards pre-login cart intent).
- **What can go wrong:** Guest can access `/cart` or `/profile` directly.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J5: Cart functionality
- **Goal:** Manage items in cart.
- **Actor:** Customer
- **Priority:** P0
- **Preconditions:** Logged in. Product B (Multiple sizes, stock 20) exists.
- **Steps:**
  1. Go to Product B. Select size M, quantity 1. Add to Cart. `POST /api/cart` 200.
  2. Add Product B again, size M, quantity 2. Cart updates to quantity 3.
  3. Add Product B, size L, quantity 1. Cart shows two separate line items.
  4. Go to Cart (`/cart`). UI shows items, sizes, total price formatted in INR (e.g., ₹1,500).
  5. Increase quantity of size M to 25. UI prevents or server rejects (Stock limited to 20).
  6. Remove size L item. `DELETE /api/cart/:productId/:size` 200. Item disappears.
  7. Refresh page. Cart data persists.
  8. Logout and Login again. Cart data persists.
  9. Remove all items. UI shows empty state.
- **What can go wrong:** Cart totals calculate incorrectly, INR grouping fails (shows 10000 instead of 10,000), stock limits bypassed in cart update.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J6: Wishlist
- **Goal:** Save items for later.
- **Actor:** Customer
- **Priority:** P1
- **Preconditions:** Logged in.
- **Steps:**
  1. Browse `/men`. Click Heart icon on Product A. Heart fills. `POST /api/users/wishlist/:id` 200.
  2. Go to Profile -> Wishlist. Product A is listed.
  3. Click "Move to Cart" (if implemented) or simply verify it appears.
  4. Click Heart icon again on listing or profile. `DELETE /api/users/wishlist/:id` 200. Item removed.
- **What can go wrong:** Wishlist doesn't sync across devices or requires hard refresh to show.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J7: COD order, full flow
- **Goal:** Place an order via Cash on Delivery.
- **Actor:** Customer
- **Priority:** P0
- **Preconditions:** Logged in, Cart has 1 qty of Product D (Stock 1). DB: Product D stock = 1.
- **Steps:**
  1. Go to Checkout.
  2. Enter invalid phone (123). UI blocks submit. Enter invalid PIN (12). UI blocks.
  3. Enter valid address (John Doe, 9876543210, 123 Street, City, State, 680001).
  4. Select COD. Click Place Order.
  5. `POST /api/orders` 201. UI redirects to `/orders`.
  6. DB Check: Product D `stock` is now `0`. Order document created with `status: 'pending'`, `paymentMethod: 'cod'`. Cart is cleared (`items: []`).
  7. Email Check: Order confirmation email arrives to user.
  8. Go to `/orders`. Order appears as Pending. Click to view details (`/api/orders/:id` 200).
- **What can go wrong:** Stock not decremented, cart not cleared, 500 error on email failure.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J8: Razorpay success
- **Goal:** Place an order via Razorpay successfully.
- **Actor:** Customer
- **Priority:** P0
- **Preconditions:** Logged in, Cart has 1 qty of Product A (Stock 10). DB: Product A stock = 10. Ngrok running.
- **Steps:**
  1. Checkout -> Valid address -> Select Razorpay. Place Order.
  2. `POST /api/orders` 201. UI opens Razorpay modal. DB: Product A `stock` is now `9`. Order created as `paymentStatus: 'pending'`. Cart NOT cleared yet.
  3. In modal, enter test card details. Success. Modal closes.
  4. Frontend calls `POST /api/orders/verify-payment`. Returns 200. UI redirects to `/orders`.
  5. Ngrok shows `POST /api/payments/webhook` incoming. Webhook processes `payment.captured`.
  6. DB Check: Order `paymentStatus` is `paid`. Cart is cleared. Stock remains `9` (no double deduction).
  7. Email Check: Exactly ONE confirmation email received (verify-payment sets it to paid and sends email; webhook sees it's already paid and logs a warning, preventing duplicate email).
- **What can go wrong:** Cart clears before payment (if user cancels, cart is lost), double email sent, stock deducted twice.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J9: Razorpay abandoned (and Cron check)
- **Goal:** Handle dropped drop-offs and recover stock.
- **Actor:** Customer / Cron
- **Priority:** P1
- **Preconditions:** Cron set to 1 minute for testing. Cart has Product B (qty 1). DB: Product B stock = 20.
- **Steps:**
  1. Checkout -> Select Razorpay. Place Order.
  2. Razorpay modal opens. DB: Product B `stock` = 19. Order `paymentStatus` = `pending`. Cart still has items.
  3. Close modal explicitly or refresh page.
  4. UI goes back to checkout or home. Order is left hanging.
  5. Wait 1-2 minutes for the cron job to run.
  6. Watch server logs: "Cron: Cancelled X stale Razorpay orders and restored stock."
  7. DB Check: Order `status` and `paymentStatus` are `cancelled`. Product B `stock` is restored to `20`. COD pending untouched.
  8. Go to Checkout again. Cart is still intact.
  *(Restore Cron threshold to 30 mins after this test!)*
- **What can go wrong:** Stock permanently lost, cron affects COD orders (it shouldn't).
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J10: Razorpay failure and retry
- **Goal:** Customer fails payment but pays from the orders page later.
- **Actor:** Customer
- **Priority:** P1
- **Preconditions:** Cart has Product A.
- **Steps:**
  1. Checkout -> Razorpay -> Place Order. Modal opens.
  2. Use failure test card or fail via simulator. Modal shows failure.
  3. Close modal. UI says "Payment failed... saved as pending".
  4. Ngrok catches `payment.failed` webhook. Server logs it. Order remains pending.
  5. Navigate to Profile -> Orders. NOT IMPLEMENTED (Currently no frontend "Pay Now" button for pending orders based on code review).
- **What can go wrong:** Failed webhook cancels the order prematurely preventing retries.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J11: Webhook edge cases
- **Goal:** Ensure webhook security and idempotency.
- **Actor:** External (Postman / Razorpay Dashboard)
- **Priority:** P1
- **Preconditions:** Ngrok URL configured.
- **Steps:**
  1. From Razorpay dashboard, replay a successful `payment.captured` event for an already `paid` order.
  2. Server logs "Warning: Late payment captured for non-pending order!". Returns 200. DB untouched, no emails.
  3. Send a POST to `/api/payments/webhook` via Postman with invalid `x-razorpay-signature`. Server returns 400 "Invalid signature".
  4. Webhook for an unknown order: Server logs warning, returns 200.
  5. Late payment on a cron-cancelled order: Server logs "Late payment captured for non-pending order", returns 200. Order stays cancelled (Admin must manually refund or fulfill).
  6. Ngrok URL change requires updating dashboard.
- **What can go wrong:** Invalid signatures cause 500s, replay attacks send multiple emails.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J12: Stock races
- **Goal:** Prevent overselling under concurrent load.
- **Actor:** Two Customers
- **Priority:** P1
- **Preconditions:** Product D has stock 1. Two browsers logged in as different users, both have Product D in cart.
- **Steps:**
  1. Browser A: Go to Checkout.
  2. Browser B: Go to Checkout.
  3. Browser A: Clicks Place Order (COD). Success. Stock becomes 0.
  4. Browser B: Clicks Place Order (COD).
  5. Server returns 400 "only 0 left in stock". Order fails. DB: Stock remains 0.
- **What can go wrong:** Both orders succeed leaving stock at -1.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J13: Tampering and security
- **Goal:** Prevent malicious API requests.
- **Actor:** Attacker
- **Priority:** P0
- **Preconditions:** Postman or browser DevTools.
- **Steps:**
  1. In `POST /api/orders`, send `totalAmount: 1` bypassing cart total. Server recalculates and ignores the payload amount.
  2. Send `GET /api/orders/:id` using Order ID of another customer. Server returns 403.
  3. Attempt `POST /api/products` (Admin route) using standard customer token. Returns 403 Forbidden.
  4. Open `/admin` as standard customer. Returns 403/redirect.
  5. Inject NoSQL in login: Email: `{"$gt": ""}`. Zod validates strict string, request fails 400.
  6. Inject XSS in Address: `<script>alert(1)</script>`. Submit order. Check Order details page and Email; tags should be rendered as plain text or escaped, not executed.
  7. Check rate limit on orders. Webhooks should not be rate limited.
- **What can go wrong:** Price manipulation bypasses server checks, NoSQL injection bypasses password check.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J14: Orders and profile
- **Goal:** Account management.
- **Actor:** Customer
- **Priority:** P2
- **Preconditions:** Logged in.
- **Steps:**
  1. Navigate to Profile. Update details (valid and invalid).
  2. Navigate to Orders. List shows recent orders. Status labels reflect accurate state (Pending, Paid, Shipped, etc.).
  3. Change Password. Enter old, enter new. Success.
  4. Saved addresses: NOT IMPLEMENTED.
  5. Cancel Order: NOT IMPLEMENTED.
- **What can go wrong:** Password change doesn't invalidate tokens.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J15: Admin workflows
- **Goal:** Manage catalog and fulfill orders.
- **Actor:** Admin
- **Priority:** P1
- **Preconditions:** Logged in as Admin.
- **Steps:**
  1. Open `/admin`. Dashboard loads.
  2. Add Product: fill all fields, invalid input shows error. Valid submit shows immediately on storefront.
  3. Edit Product: Remove `originalPrice` (leave empty), hit save. Reopen edit. Value must be null/empty, NOT `0`.
  4. Edit Product: Change nothing, hit save. No data is lost.
  5. Delete Product. Disappears from catalog.
  6. Orders Page: View list of all orders.
  7. Change an order status from `pending` to `shipped`. DB updates. Customer viewing their profile sees `shipped`.
  8. Users Page: NOT IMPLEMENTED.
  9. Admin pages as guest/customer redirects.
- **What can go wrong:** Empty numeric fields default to 0 on save, admin routes accidentally accessible.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J16: Community Club and static pages
- **Goal:** Verify frontend static content.
- **Actor:** Guest
- **Priority:** P3
- **Preconditions:** None.
- **Steps:**
  1. Navigate to Community Club. Verify it is UI only (no backend calls).
  2. Verify all buttons layout correctly.
  3. Click Contact, About, Terms in footer. Verify text loads.
- **What can go wrong:** Broken links, 404 errors.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J17: Emails
- **Goal:** Formatting and deliverability.
- **Actor:** Anyone
- **Priority:** P1
- **Preconditions:** Run Journeys 2, 3, 7, 8.
- **Steps:**
  1. Check inbox for Verification, Reset, Login Alert, Password Changed, and Order Confirmations.
  2. Check Spam folders.
  3. Verify subjects are clear.
  4. Verify prices in order confirmations are formatted as ₹X,XXX.
  5. Verify links point to the correct `CLIENT_URL` (not localhost if tested on prod).
  6. Verify HTML escaping and plain-text version.
- **What can go wrong:** Links broken because env var is missing, HTML not rendering in Gmail.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J18: Errors and resilience
- **Goal:** Graceful degradation.
- **Actor:** Guest / Customer
- **Priority:** P1
- **Preconditions:** DevTools open.
- **Steps:**
  1. Stop backend server. Click around client. UI shows friendly "Cannot connect to server" instead of blank screens.
  2. Start server. Throttle network to 'Slow 3G' in DevTools. Load products. UI shows loading spinners/skeletons.
  3. Expire token mid-checkout via cookies. Attempt place order. 401 triggers redirect to login.
  4. Go to `/api/random_route`. Returns JSON `{ "message": "Not Found" }` 404, not an HTML error page.
  5. Check API responses for 500 errors; no stack traces should be visible in production mode.
  6. Zero red console errors on every page.
- **What can go wrong:** App crashes entirely on network failure.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J19: Responsive design
- **Goal:** Mobile usability.
- **Actor:** Guest
- **Priority:** P1
- **Preconditions:** DevTools Device Toolbar.
- **Steps:**
  1. Test at 360px, 390px, 768px, 1024px, 1280px, 1920px.
  2. Open Hamburger menu. Works smoothly.
  3. Filter Drawer opens over content instead of squishing it.
  4. Cart layout stacks correctly (images not skewed).
  5. Checkout forms inputs are full width.
  6. Admin tables scroll horizontally or stack.
  7. No horizontal overflow on the body `overflow-x: hidden`.
  8. Keyboard over inputs tested.
  9. Hover zoom off on touch.
- **What can go wrong:** Checkout un-clickable on mobile.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J20: Cross-browser and devices
- **Goal:** Broad compatibility.
- **Actor:** Guest / Customer
- **Priority:** P1
- **Preconditions:** Physical devices.
- **Steps:**
  1. Open Safari (iOS). Login. Ensure `SameSite: None; Secure` cookie behaves correctly (requires HTTPS/Vercel proxies).
  2. Test on real Android phone (Chrome).
  3. Firefox on desktop.
- **What can go wrong:** Safari blocks third-party cookies if backend and frontend are on different domains without proxy.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J21: Accessibility and performance
- **Goal:** Standards compliance.
- **Actor:** Guest
- **Priority:** P2
- **Preconditions:** Lighthouse tool.
- **Steps:**
  1. Run Lighthouse on Home, PLP, PDP. Target: >80 Performance, >90 A11y.
  2. Use Tab key to navigate from Home to Checkout. Focus must be visible.
  3. Images must have `alt` tags. Contrast checked.
- **What can go wrong:** Large unoptimized images (noted in audit) drag down performance.
- **Result:** [ ] Pass / Fail. Notes: ______________________

### J22: Deployed-site retest
- **Goal:** Production configuration validation.
- **Actor:** Admin
- **Priority:** P0
- **Preconditions:** Deployed to Render/Vercel.
- **Steps:**
  1. Refresh the SPA on `/cart`. Must not 404 (Vercel rewrites configured).
  2. Login. Cookies must set correctly (CORS and domain config).
  3. Process real Razorpay test payment with real webhook URL and new secret.
  4. Test email delivery from production server.
  5. Cron and Render sleep behavior tested.
  6. HTTPS everywhere. iPhone Safari login.
- **What can go wrong:** Render free tier sleeps causing 50-second timeouts on first load.
- **Result:** [ ] Pass / Fail. Notes: ______________________

---

## Final Parts

### 1. Smoke Test (Post-Deploy Checklist)
*Run this 10-minute check after every deployment:*
1. Load homepage, verify images appear.
2. Login as existing verified user.
3. Add an item to cart.
4. Checkout via COD.
5. Check order appears in Profile -> Orders.
6. Check Admin dashboard loads.
7. Logout.

### 2. Coverage Matrix

| Feature/Endpoint | Tested In Journey |
| :--- | :--- |
| `POST /api/auth/signup` | J2 |
| `POST /api/auth/login` | J2 |
| `POST /api/auth/verify-email` | J2 |
| `POST /api/auth/refresh` | J2 |
| `POST /api/auth/logout` | J2 |
| `POST /api/auth/forgot-password` | J3 |
| `GET /api/products` | J1 |
| `GET /api/products/search` | J1 |
| `POST /api/cart` | J5 |
| `POST /api/orders` | J7, J8 |
| `POST /api/orders/verify-payment` | J8 |
| `POST /api/payments/webhook` | J8, J11 |
| `cron cancelStaleOrders` | J9 |
| Admin `POST /api/products` | J15 |

### 3. Needs a Decision / Unfinished Business
- **Razorpay Pending Retries:** Currently, a failed Razorpay order stays pending, but the frontend lacks a "Pay Now" button to retry payment for an existing pending order.
- **User Order Cancellation:** Customers cannot cancel their own orders; they must contact support.
- **Image Optimization:** Images are currently served raw and can be 2MB+, requiring a CDN/Vite plugin implementation.

### 4. Bug Log Template

| ID | Journey | Steps to Reproduce | Expected Result | Actual Result | Severity | Screenshot |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| BUG-01 | J2 | 1. Sign up<br>2. Try login immediately | Blocked with "Please verify" | Allowed to login | P0 | [Link] |
| | | | | | | |
