# XTRN E-Commerce Manual Testing Checklist

## Section 0: Setup
- **Environment Variables**: Ensure the following are set in `server/.env`:
  `MONGO_URI`, `PORT`, `NODE_ENV`, `FRONTEND_URL`, `CLIENT_URL`, `JWT_SECRET`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `EMAIL_FROM`, `GMAIL_USER`, `EMAIL_APP_PASSWORD`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
- **Razorpay**: Set up a test account, configure the webhook URL (use Ngrok to expose your local server, e.g., `https://<ngrok-id>.ngrok-free.app/api/payments/webhook`). Webhook events needed: `payment.captured` and `payment.failed`. Test card details: Any valid Visa test card, CVV 111, expiry any future date. Note: `payment.failed` only logs on the server; the order remains pending and stock is not restored.
- **Admin Setup**: Create a user normally via the UI, then use MongoDB Compass to manually change their `role` field from `"user"` to `"admin"`. 
- **Seeding**: Add products via the Admin Dashboard. Ensure some products have only 1 size, some have multiple, and at least one is out of stock.

---

## 1. Auth & Profile
- [ ] AUTH-01 | Signup: Enter name "A!", email "test@test.com", password "password". | **P1** | Fails with "Invalid characters in name" (allows only alphanumeric, space, -, _).
- [ ] AUTH-02 | Signup: Enter name "Ab", email "invalid-email", password "password". | **P1** | Fails with email validation error.
- [ ] AUTH-03 | Signup: Enter password less than 8 chars (e.g. "pass"). | **P1** | Fails with min 8 characters error.
- [ ] AUTH-04 | Signup: Successful signup with valid data (e.g. "John Doe", "john@example.com", "Password123"). | **P0** | Success, check inbox for verification email. User created as `isVerified: false`.
- [ ] AUTH-05 | Verification: Click the link in the email. | **P0** | User verified successfully, redirected to login.
- [ ] AUTH-06 | Resend Verification: Try to login before verifying, click resend if prompted/available. | **P2** | New email sent, old link becomes invalid (if token regenerates).
- [ ] AUTH-07 | Login: Unverified user. | **P1** | Error message indicating email not verified.
- [ ] AUTH-08 | Login: Wrong password. | **P0** | Error message indicating invalid credentials.
- [ ] AUTH-09 | Login: Valid credentials. | **P0** | Logs in, redirects to home or intended page. 
- [ ] AUTH-10 | Logout: Click logout. | **P0** | Successfully logged out, tokens cleared from cookies/storage.
- [ ] AUTH-11 | Refresh Token: Wait for access token expiry (or force it via DevTools) and navigate. | **P1** | Stays logged in seamlessly.
- [ ] AUTH-12 | Forgot Password: Submit email. | **P1** | Reset link sent to email.
- [ ] AUTH-13 | Reset Password: Use the link to set a new password. | **P0** | Password updated successfully.
- [ ] AUTH-14 | Reset Password: Try to reuse the same link. | **P2** | Fails with invalid/expired token message.
- [ ] AUTH-15 | Protected Routes: Access `/profile` or `/admin` directly via URL while logged out. | **P1** | Redirected to login.
- [ ] AUTH-16 | Admin Routes: Access `/admin` directly via URL as a normal logged-in user. | **P1** | Redirected to home or 403 Forbidden.
- [ ] AUTH-17 | Profile Edit: Change name to "X" (1 char). | **P2** | Fails with "Name must be at least 2 characters".
- [ ] AUTH-18 | Profile Edit: Valid update. | **P1** | Details updated.
- [ ] AUTH-19 | Rate Limiter: Spam login endpoint repeatedly (e.g. 20+ times). | **P2** | Returns 429 Too Many Requests with rate limit message.

## 2. Navigation
- [ ] NAV-01 | Navbar: Click every gender ('men', 'women') and category link. | **P1** | Navigates to correct product listing with query params applied.
- [ ] NAV-02 | Breadcrumbs: Click breadcrumb links on listing or detail pages. | **P2** | Navigates to correct parent category.
- [ ] NAV-03 | Footer: Click footer links. | **P2** | All static/info pages load correctly.
- [ ] NAV-04 | 404 Page: Navigate to `/random-non-existent-page`. | **P1** | Displays custom 404 Not Found page.
- [ ] NAV-05 | Scroll Reset: Scroll down on a long page, click a link to a new page. | **P2** | Window scroll resets to the top (Y=0).
- [ ] NAV-06 | Browser History: Use back and forward buttons across categories. | **P1** | State updates correctly, URL matches displayed content.

## 3. Product Listing & Search
- [ ] PLP-01 | Filters: Open listing via navbar (e.g. Men). | **P1** | Gender filter is hidden or locked to Men.
- [ ] PLP-02 | Filters: Apply multiple filters (e.g. Price 0-1000, Size M). | **P1** | Products update immediately or on apply.
- [ ] PLP-03 | Filters: Clear all filters. | **P1** | Shows all products for the current base category.
- [ ] PLP-04 | Sorting: Sort by Price Low-High, High-Low. | **P1** | Products are sorted correctly.
- [ ] PLP-05 | Pagination: If > limits, click next page. | **P1** | Next set of products loads.
- [ ] PLP-06 | URL State: Apply filters and refresh the page. | **P1** | Filters remain applied (read from URL).
- [ ] PLP-07 | Empty Results: Apply strict filters that yield 0 products. | **P1** | Displays a friendly empty state message, no crashes.
- [ ] PLP-08 | Search: Search for "shirt". | **P1** | Shows relevant products.
- [ ] PLP-09 | Search: Search for partial word, special chars (e.g. `s!h%i$rt`), very long string. | **P2** | No 500 crashes, handles NoSQL regex injection safely, returns empty or relevant.
- [ ] PLP-10 | Out of Stock: Check a product with `stock: 0`. | **P1** | Displayed with "Out of Stock" overlay/badge.

## 4. Product Details
- [ ] PDP-01 | Images: Check main image and thumbnails. | **P1** | Thumbnails exist, clicking thumbnail updates the main image.
- [ ] PDP-02 | Hover Zoom: Hover main image on Desktop (mouse). | **P1** | Zooms in, tracks cursor seamlessly without layout jumps.
- [ ] PDP-03 | Hover Zoom Touch: Test on touch device or DevTools mobile view. | **P2** | Zoom is disabled.
- [ ] PDP-04 | Hover Zoom Reset: Click a thumbnail while hovering. | **P2** | Zoom resets correctly for the new image.
- [ ] PDP-05 | Size Selection: Try adding to cart without selecting a size (if multiple exist). | **P1** | Shows error: "Please select a size".
- [ ] PDP-06 | Size Auto-select: View a product with exactly 1 size. | **P2** | Size is auto-selected on load.
- [ ] PDP-07 | Quantity Limit: Try adding more than available stock. | **P1** | Prevented by UI or shows stock limit error.
- [ ] PDP-08 | Price Display: Verify price formatting. | **P0** | Price shows in Indian Rupees (₹) with `en-IN` formatting. Original price has strike-through.
- [ ] PDP-09 | Wishlist Button: Click heart icon. | **P1** | Adds/removes from wishlist.

## 5. Cart
- [ ] CRT-01 | Add Item: Add a product and go to cart. | **P0** | Product appears with correct size, price, and quantity.
- [ ] CRT-02 | Same Item: Add the same product + size again. | **P1** | Quantity increments, does not create duplicate row.
- [ ] CRT-03 | Diff Size: Add the same product but different size. | **P1** | Appears as a separate cart item.
- [ ] CRT-04 | Quantity Change: Increase/decrease in cart. | **P0** | Total price recalculates immediately. Cannot decrease below 1.
- [ ] CRT-05 | Stock Limit: Increase quantity beyond stock in cart. | **P1** | API returns error, reverts to max stock.
- [ ] CRT-06 | Remove Item: Click remove/trash icon. | **P0** | Item removed, total updates.
- [ ] CRT-07 | Empty Cart: Remove all items. | **P1** | Shows "Cart is empty" state.
- [ ] CRT-08 | Persistence: Add item, refresh page. | **P1** | Item remains in cart.
- [ ] CRT-09 | Auth Persistence: Add item logged out, log in. | **P1** | NOT IMPLEMENTED (Cart merge after login does not exist in code).

## 6. Wishlist
- [ ] WSH-01 | Add to Wishlist: From listing or PDP. | **P1** | Heart turns solid/filled.
- [ ] WSH-02 | Logged Out: Try adding while logged out. | **P2** | Redirects to login.
- [ ] WSH-03 | Remove: Click heart again. | **P1** | Removed from wishlist.
- [ ] WSH-04 | View: Go to Profile -> Wishlist. | **P1** | Added items are listed here.

## 7. Checkout
- [ ] CHK-01 | Validation - Phone: Enter 9 digits or text. | **P1** | Fails with "Phone must be exactly 10 digits".
- [ ] CHK-02 | Validation - Pincode: Enter 5 digits. | **P1** | Fails with "Pincode must be exactly 6 digits".
- [ ] CHK-03 | Validation - Names: Enter < 2 chars for name, city, state, address. | **P1** | Fails with respective min length errors.
- [ ] CHK-04 | Order Summary: Compare total amount with Cart total. | **P0** | Must match exactly.
- [ ] CHK-05 | Tampering: Intercept API call or use DevTools to change totalAmount in the request payload. | **P0** | Backend must recalculate using DB prices and reject/ignore the spoofed amount.
- [ ] CHK-06 | Out of Stock Race: Use 2 browsers. Browser A is on checkout. Browser B buys the last stock. Browser A places order. | **P0** | Fails gracefully with out-of-stock error.
- [ ] CHK-07 | Double Click: Double click "Place Order" rapidly. | **P2** | Button disables, only one order created.

## 8. Razorpay & Webhook
- [ ] RZP-01 | Success Flow: Select Razorpay, pay with test card. | **P0** | Order marked as Paid, stock reduced, cart cleared.
- [ ] RZP-02 | Modal Close: Close Razorpay modal without paying. | **P1** | Order remains `pending`, stock is reserved (if implemented), no confirmation email sent.
- [ ] RZP-03 | Retry Payment: From Orders list, retry payment on the pending order. | **P1** | NOT IMPLEMENTED (No retry button exists).
- [ ] RZP-04 | Duplicate Webhook: Replay the exact same `payment.captured` event from Razorpay Dashboard. | **P1** | System ignores duplicate safely (idempotent), stock not reduced twice.
- [ ] RZP-05 | Invalid Webhook Signature: Send POST to `/api/payments/webhook` with fake signature using Postman. | **P1** | Returns 400 with "Invalid signature".
- [ ] RZP-06 | Ngrok Restart: Restart ngrok, update Razorpay dashboard with new URL. | **P0** | Webhook continues to work on the new URL.
- [ ] RZP-07 | Retry Success: Payment fails, then a retry succeeds (within the same modal session). | **P0** | Order paid, stock correct, exactly one confirmation email sent.
- [ ] RZP-08 | Invalid Verify Signature: Intercept `/api/orders/verify-payment` and change `razorpay_signature`. | **P1** | Returns 400, order status updates to 'failed'.
- [ ] RZP-09 | Duplicate Webhook (Already Paid): Replay `payment.captured` for an order that is already paid. | **P0** | No refund triggered, no second email sent, no stock change.

## 9. Cron (Stale Orders)
*Setup: Edit `server/jobs/cancelStaleOrders.js` to change `30 * 60 * 1000` to `1 * 60 * 1000` (1 minute). Restart server.*
- [ ] CRN-01 | Razorpay Pending: Create a Razorpay order, close modal. Wait 2+ minutes. | **P1** | Order status changes to `cancelled`, stock is restored.
- [ ] CRN-02 | COD Pending: Create a COD order. Wait 2+ minutes. | **P1** | COD orders are ignored by this cron job.
- [ ] CRN-03 | Late Payment: Capture payment on an order the cron already cancelled (simulate late webhook). | **P1** | Server logs a warning (`Warning: Late payment captured for non-pending order!`), but does not refund or update the order to paid.
*IMPORTANT: Revert the cron job limit back to 30 minutes after testing.*

## 10. Emails
- [ ] EML-01 | Order Confirmation (COD): Place COD order. | **P1** | Receive exactly 1 email. Check total (in Rupees), items, and address.
- [ ] EML-02 | Order Confirmation (RZP): Complete a Razorpay order. | **P1** | Receive exactly 1 email upon successful payment.
- [ ] EML-03 | HTML Escaping: Place order with name `<h1>Test</h1>`. | **P2** | Email renders literal text, not a large heading (no XSS).
- [ ] EML-04 | Spam Check: Check inbox vs spam for signup, reset password, and order emails. | **P2** | All emails arrive in the inbox, not spam.

## 11. Orders (User)
- [ ] ORD-01 | View List: Go to Profile -> Orders. | **P1** | Shows all orders with correct status badges.
- [ ] ORD-02 | View Detail: Click an order. | **P1** | Shows full breakdown, items, tracking info.
- [ ] ORD-03 | IDOR Check: Take an order ID from User A, log in as User B, try to hit `/api/orders/:id`. | **P0** | Returns 403 or 404, does not leak data.

## 12. Admin
- [ ] ADM-01 | Auth Check: Access `/api/products` via POST (create) using a normal user token. | **P0** | Returns 403 Forbidden.
- [ ] ADM-02 | Product Add: Fill form completely (all images, categories). | **P1** | Product created, visible on frontend.
- [ ] ADM-03 | Product Add Validation: Leave required fields blank. | **P2** | Fails with Zod validation errors.
- [ ] ADM-04 | Product Edit: Leave `originalPrice` empty/blank. | **P1** | Saves successfully as undefined/null without casting to `NaN`.
- [ ] ADM-05 | Product Delete: Delete a product. | **P1** | Disappears from frontend and admin panel.
- [ ] ADM-06 | Order Status: Change order status to `shipped` or `delivered`. | **P1** | Updates successfully, user sees new status.
- [ ] ADM-07 | Mass Assignment: Update a product with an unknown field in the body. | **P1** | Ignored by Zod validation, unknown field is not saved to the DB.

## 13. Community Club
*Note: This feature is entirely static/frontend-only. There is no backend DB functionality for posts or rewards.*
- [ ] COM-01 | View Feed: Navigate to `/community`. | **P2** | The CommunityNavBar, Hero, Intro, UpcomingEvents, Feed, RewardsBanner, and Testimonials load properly.
- [ ] COM-02 | Interactive Elements: Click static buttons in the CommunityHero or RewardsBanner. | **P2** | Expected to do nothing or open a coming-soon modal (since it's frontend-only).
- [ ] COM-03 | Responsiveness: View `/community` on a mobile width (390px). | **P2** | The custom GSAP layouts and animations format nicely on small screens without breaking.

## 14. Currency and Text
- [ ] TXT-01 | Currency Symbol: Check PLP, PDP, Cart, Checkout, Emails. | **P1** | All prices must strictly use `₹` or `INR`. No `$` or `USD`.
- [ ] TXT-02 | Formatting: Check numbers > 1000. | **P2** | Formatted as `1,000` or `1,000.00`.
- [ ] TXT-03 | Fallbacks: Scan site for `undefined`, `NaN`, `null` strings. | **P1** | None should be visible.

## 15. Error Handling & Edge Cases
- [ ] ERR-01 | Server Down: Stop the backend server, try to load the frontend. | **P1** | Fails gracefully, no white screen of death, shows network error.
- [ ] ERR-02 | Invalid Product ID: Go to `/product/123invalid`. | **P1** | Displays "Product not found" or 404, does not crash.
- [ ] ERR-03 | Console Errors: Open DevTools console and click through the core flow. | **P2** | Zero red errors (React keys, undefined vars).
- [ ] ERR-04 | Unknown API Route: Hit a non-existent `/api/fake-route`. | **P1** | Returns JSON `{"message": "API route not found"}` with a 404 status.
- [ ] ERR-05 | No Stack Traces: Trigger a 500 error intentionally (e.g. stop DB). | **P0** | API returns `{"message": "Internal Server Error"}` with no raw `error.message` or stack trace exposed to the client.

## 15.b Rate Limiting
- [ ] RTL-01 | API Limit Check: Spam POST `/api/orders` or `/api/orders/verify-payment` 31 times within 15 minutes. | **P1** | 31st request fails with `{"message": "Too many requests. Please try again later."}` (status 429).
- [ ] RTL-02 | Webhook Limit Check: Spam POST `/api/payments/webhook` 35 times. | **P1** | Succeeds (or returns 400 for bad signature), confirming no rate limiter is blocking Razorpay webhooks.

## 16. Responsive & UI
- [ ] RES-01 | Mobile (360/390px): Check hamburger menu, filter drawer, checkout form width. | **P1** | Usable, no horizontal scrolling.
- [ ] RES-02 | Tablet (768px): Check grid columns. | **P2** | Scales correctly.
- [ ] RES-03 | Desktop (1024/1280/1920px): Check max-width constraints. | **P2** | Layout doesn't stretch infinitely.

## 17. Security Spot Checks
- [ ] SEC-01 | XSS in inputs: Enter `<script>alert(1)</script>` in address or name fields. | **P0** | Rendered as text, script does not execute. (Zod `safeString` regex `/^[^<>]*$/` should block this at the API level).
- [ ] SEC-02 | NoSQL Injection: Enter `{"$gt": ""}` in email field during login. | **P0** | Rejected by validator (fails email regex).

## 18. Performance & Accessibility
- [ ] PERF-01 | Lighthouse: Run Chrome Lighthouse on PDP. | **P2** | Score > 80 for Performance and Accessibility.
- [ ] PERF-02 | Keyboard Nav: Use Tab to navigate checkout. | **P2** | Focus is visible and logical.

## 19. Production / Deployed Retest
- [ ] PROD-01 | Cross-Domain Cookies: Login on deployed frontend. | **P0** | Session persists (SameSite/Secure cookie flags set correctly).
- [ ] PROD-02 | Razorpay Prod: Update webhook with production API URL. | **P0** | Webhooks hit the deployed server.
- [ ] PROD-03 | HTTPS: Ensure all API calls use `https://`. | **P0** | No mixed content warnings.

---

### Post-Deploy Smoke Test (The 10-Minute Check)
1. Signup a test user & verify email.
2. Login and browse products (check filters).
3. Open a product, check price and zoom, add to cart.
4. Go to checkout, use invalid pincode (expect failure).
5. Place COD order successfully.
6. Verify Order confirmation email received.
7. Place Razorpay order successfully.
8. Pay with Razorpay, then check the order becomes paid and the ngrok inspector (http://127.0.0.1:4040) shows POST /api/payments/webhook returning 200.
9. Check admin panel: Edit a product price and save.
10. Attempt to load `/api/orders` directly in browser (expect 401/403).

### Changes made
1. Fixed webhook URL to `/api/payments/webhook` in setup, RZP-05, and smoke test.
2. Updated webhook events from `order.paid` to `payment.captured` and documented `payment.failed` behavior.
3. Replaced Section 13 with verified frontend-only tests for Community Club (NavBar, Hero, Intro, UpcomingEvents, Feed, RewardsBanner, Testimonials).
4. Rewrote smoke test step 8 to use ngrok inspector (`http://127.0.0.1:4040`) for webhook verification.
5. Marked "Retry Payment", "Cart Merge", and "Cancel Order" features as NOT IMPLEMENTED. Verified reviews are hardcoded as 128. Removed "if implemented".
6. Verified exact Zod validation rules (name lengths, pincode, phone).
7. Verified cron interval (30 min limit runs every 5 mins) and late payment behavior (logs a warning).
8. Added tests RZP-07, RZP-08, RZP-09, CRN-03, EML-04.
9. Added Rate Limiting tests and Error Handling stack trace / 404 tests.
10. Added Admin mass assignment protection test.
