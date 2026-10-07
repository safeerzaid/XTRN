# XTRN E-Commerce - Manual Testing Checklist

## Project Overview
XTRN is a premium sports and activewear e-commerce storefront. The project features a robust product catalog categorized by department, sport, and category, user authentication (with email verification and password resets), shopping cart, wishlist functionality, user profiles, and order management with payment integration (Razorpay). 
**Tech Stack**: React 19, Vite 8, Tailwind CSS v4, GSAP 3 (Frontend) | Node.js, Express 5, MongoDB (Mongoose), Razorpay (Backend).

## 1. Setup and Run
- [ ] SR-1 | Environment | Create `.env` from `.env.example` in both `client` and `server` | Server and client start successfully | High
- [ ] SR-2 | Install | Run `npm install` in `client` and `server` | No missing critical dependencies or fatal peer dependency errors | High
- [ ] SR-3 | Startup | Run `npm run dev` in `client` and `npm run dev` in `server` | Apps start without crash errors (Vite on port 5173, backend on 5000) | High

## 2. Core Features
- [ ] CF-1 | Home Page | Scroll through homepage to check GSAP animations, featured collections, and mega menu | Animations trigger smoothly without layout shift | Medium
- [ ] CF-2 | Product Listing | Navigate to `ProductListingPage` and filter by department/sport | Products filter accurately matching MongoDB queries | High
- [ ] CF-3 | Product Detail | Click a product to open `ProductDetailPage` | Shows correct details, images, sizes, and Add to Cart button | High
- [ ] CF-4 | Search | Enter term in search bar leading to `SearchResultsPage` | Returns accurate matches based on product name, brand, or category | High
- [ ] CF-5 | Wishlist | Click heart icon on a product | Product is added/removed from `Wishlist` (persists in DB) | Medium

## 3. User Flows
- [ ] UF-1 | End-to-End Checkout | Signup -> Login -> Add to Cart -> Checkout -> Pay (Razorpay) -> View Order | Order successfully created, stock updated, payment verified | High
- [ ] UF-2 | Password Recovery | Forgot Password -> Click email link -> Reset Password -> Login | User can login with new password | High
- [ ] UF-3 | Admin Flow | Login as Admin -> Navigate to `/admin` -> Update product/order status | Changes reflect immediately on client and DB | High

## 4. Forms and Inputs
- [ ] FI-1 | Authentication Forms | Submit login/signup with empty fields, invalid email format, short password | Proper validation errors shown, no submission | High
- [ ] FI-2 | Checkout Form | Enter invalid shipping address or missing fields | Prevents proceeding to payment | High
- [ ] FI-3 | Search Input | Enter very long text or special characters (`%`, `<script>`) | Handled gracefully without breaking UI or regex crash | Medium

## 5. Authentication and Permissions
- [ ] AP-1 | Login/Logout | Test valid login, then logout | Token/cookie cleared, redirected to Home/Login | High
- [ ] AP-2 | Protected Routes | Access `Profile`, `CheckoutPage`, `CartPage` without logging in | Redirected to Login page | High
- [ ] AP-3 | Role-Based Access | Non-admin user trying to access `PUT /api/products/:id` or `/admin` routes | Receives 403 Forbidden / UI blocked | High
- [ ] AP-4 | Session Expiry | Wait for JWT to expire or manually delete cookie | User is prompted to log in again on next action | Medium

## 6. API / Backend
- [ ] API-1 | `GET /api/products` | Test query params (sport, department, featuredCategory) | Returns 200 OK and correct JSON array | High
- [ ] API-2 | `POST /api/orders` | Send order without auth token | Returns 401 Unauthorized | High
- [ ] API-3 | `POST /api/orders/verify-payment` | Send invalid Razorpay signature | Returns 400 Bad Request, order not marked paid | High
- [ ] API-4 | Rate Limiting | Spam requests to `/api/orders` or auth routes | Returns 429 Too Many Requests | Medium

## 7. Database
- [ ] DB-1 | Product Seed | Check `seedProduct.js` execution | Products populate correctly in MongoDB | High
- [ ] DB-2 | Data Relations | Check Order document in DB | Contains correct `user` reference and `product` references | High
- [ ] DB-3 | Cascading Deletes | Delete a user (if supported) | Check if their cart/wishlist are cleaned up | Low

## 8. Edge Cases and Error Handling
- [ ] EC-1 | Network Drop | Disconnect internet while on `CheckoutPage` | Shows offline message or fails gracefully | Low
- [ ] EC-2 | Empty States | View Cart and Wishlist when empty | Displays "Your cart is empty" instead of blank page | Medium
- [ ] EC-3 | Server Error | Manually stop backend and try to fetch products | Client shows generic error boundary/message | High
- [ ] EC-4 | Double Click | Rapidly click "Place Order" or "Pay" | Only one order is created (debounced) | High

## 9. UI / UX
- [ ] UI-1 | Responsiveness | Resize window from 4K -> Desktop -> Tablet -> Mobile | Navbar shifts to Hamburger menu, grid collapses to 1-2 columns | High
- [ ] UI-2 | Loading States | Observe pages while data fetches | Spinners or skeletons shown, no blank white screens | Medium
- [ ] UI-3 | Broken Links | Click all footer links and Community Page | No 404s (NotFound page should catch bad URLs) | Medium

## 10. Security Basics
- [ ] SEC-1 | Exposed Secrets | Inspect client bundle/network tab | No `.env` secrets (Razorpay Secret, JWT Secret) exposed to client | High
- [ ] SEC-2 | XSS Protection | Input `<script>alert(1)</script>` in profile name or search | Rendered as text, not executed | High
- [ ] SEC-3 | CORS | Attempt to call API from a different origin domain | Request blocked by CORS policy | High
- [ ] SEC-4 | Password Hashing | Check MongoDB database | Passwords stored as bcrypt hashes, not plain text | High

## 11. Performance
- [ ] PERF-1 | Bundle Size | Run `npm run build` | Warns if chunks are too large (Vite default warnings) | Medium
- [ ] PERF-2 | API Speed | Check `GET /api/products` response time | Under 200ms for standard queries | Medium
- [ ] PERF-3 | Memory Leaks | Navigate between listing and detail pages rapidly | Memory usage remains stable (React unmounts clean) | Low

## 12. Cross-browser / Cross-device
- [ ] CB-1 | Chrome | Test core flows on desktop | Works perfectly | High
- [ ] CB-2 | Safari / iOS | Test Mega Menu and animations | GSAP runs smoothly, no Safari-specific layout bugs | Medium
- [ ] CB-3 | Firefox | Test layout flex/grid | Matches Chrome appearance | Medium


## Code Review & Potential Bugs found
- **Possible Bugs / Logic Errors**:
  - `server/routes/productRoutes.js` (Line 20-30): Substring logic for `-shoes` might break or cause unintended consequences if the sport name is shorter than 6 characters or improperly formatted.
  - Rate Limiter configuration is applied to some routes (`looseLimiter` in `orderRoutes.js`), but login/signup authentication endpoints might be lacking strict rate limiters, potentially leaving them open to brute-force attacks.
  - Catch blocks in `authController.js` and `profileRoutes.js` utilize `console.log(error)` without consistently returning structured HTTP error responses. This might leave the client hanging or returning default HTML error pages instead of JSON.
- **Unused/Debug Code**: 
  - Several test/scratch files exist in the root and server directory: `scratch.js`, `scratch_db.js`, `temp1.js`, `temp2.js`, `temp_authController.js`, `test_bug.js`, `test_bug2.js`, `test_bug3.js`, `audit-orders.js`, `audit-profile.js`, `audit-wishlist.js`. These should be removed from the production branch.
  - Leftover `console.log(error)` and debugging messages throughout production routes (e.g. `wishlistRoutes.js`, `server.js`) instead of an official logger (like Pino or Winston).
- **Missing Error Handling**:
  - Database queries and general catch blocks in `server/routes/productRoutes.js` (e.g., Lines 64, 112, 126) use `res.status(500).json(...)` but do not log the actual caught error. This suppresses the error trace and makes server debugging significantly harder when API failures happen in production.
- **Missing or Outdated Dependencies**:
  - Both `client` and `server` lack any testing library configurations (e.g., Jest, Mocha, Cypress, Playwright, React Testing Library). Given the project size, this is critical.
  - Server is missing a dedicated, structured logging dependency (like `winston` or `pino`).

## Top 10 things to test first (Ranked by Risk)
1. **End-to-End Checkout Flow (UF-1)**: Core business value; if users cannot check out and pay, the business halts.
2. **Payment Verification (API-3)**: Ensure Razorpay webhook/signature validation works accurately to prevent fake orders and confirm real ones.
3. **User Registration & Login (FI-1 / AP-1)**: Authentication is a prerequisite for user profiles, order tracking, and checking out.
4. **Product Filtering & Search (CF-2 / CF-4)**: Crucial for users to discover what they want to buy. Ensure the backend queries appropriately parse complex search inputs.
5. **Form Validation & Error States (FI-1 / FI-2)**: Essential to ensure data integrity and prevent bad entries into the MongoDB database.
6. **Mobile Responsiveness & Navigation (UI-1)**: With a heavy reliance on mobile users, the multi-level hamburger menu and product grids must function flawlessly on small devices.
7. **Protected Routes Security (AP-2 / AP-3)**: Assure that admin controls and other users' carts/orders cannot be accessed by unauthorized sessions.
8. **Cart State Management (EC-2)**: Adding and removing items must accurately sync between frontend (Zustand context/storage) and backend cart/wishlist models.
9. **Environment & Secrets (SEC-1)**: Strongly verify that no sensitive API keys (Razorpay secret, JWT secret) are being bundled into the frontend client code.
10. **Application Startup (SR-3)**: Verify the standard `npm run dev` environments operate continuously without crashing, memory leaking, or terminating unexpectedly under minimal load.
