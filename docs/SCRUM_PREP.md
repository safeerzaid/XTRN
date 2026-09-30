# XTRN E-Commerce - Deep Dive Scrum Preparation Document

This document is designed to prepare you for a rigorous scrum/code-review. It details **HOW** each feature was built, **WHY** specific technical decisions were made, and **WHAT HAPPENS** during edge cases, based **entirely on the actual codebase**.

---

## PHASE 1: Core Auth & App Setup

### 1. JWT Secret Fix & Token Sync to Memory
**WHAT IT DOES:** 
Separates JWT signing into distinct Access and Refresh secrets for better security. Syncs the short-lived access token strictly into memory via a closure-based token store (`tokenStore.js`), completely avoiding `localStorage` for security.

**HOW IT WORKS:**
1. Frontend receives `accessToken` from login via `client/src/api/axios.js` (interceptor).
2. `AuthContext` calls `setAccessTokenStore(token)` from `client/src/api/tokenStore.js`.
3. Backend `server/controllers/authController.js` signs the access token using `process.env.JWT_ACCESS_SECRET` and refresh using `process.env.JWT_REFRESH_SECRET`.

**KEY LOGIC EXPLAINED:**
```javascript
// server/controllers/authController.js
const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
```
*Uses a completely different secret for the refresh token than the access token. If the access secret is compromised, the attacker still cannot forge refresh tokens.*

**WHY THIS APPROACH:** 
Using an HTTP-only cookie for the refresh token and storing the access token purely in memory provides a good balance between UX and security. It mitigates XSS attacks stealing long-lived tokens.
*Alternative not chosen:* Storing both in localStorage (highly vulnerable to XSS) or both in cookies (harder to manage multi-tab state).

**WHAT IF...**
- **Token expires mid-session:** The Axios interceptor (`client/src/api/axios.js`) catches the 401, pauses requests in a `refreshQueue`, calls `/auth/refresh`, and retries the original request.
- **Refresh token stolen and reused:** The code uses refresh token rotation (`incomingHash` check). If an already used token is sent, `user.refreshTokens = []` clears all sessions.
- **JWT Secret compromised:** We have two secrets. If access secret is leaked, they only get 15 mins of access.

**LIKELY SCRUM QUESTIONS:**
- *Q: How do you handle token storage?* A: Refresh token in an HTTP-Only strict cookie, Access token entirely in memory synced via a closure (`tokenStore.js`).
- *Q: Why rotate refresh tokens?* A: It allows us to detect token theft. If a used token is presented, we invalidate all sessions for that user.
- *Q: What happens to pending requests while refreshing?* A: They are pushed to a `refreshQueue` in the Axios interceptor and resolved once the new token arrives.
- *Q: Why two different JWT secrets?* A: Separation of concerns; an attacker guessing the access secret can't generate refresh tokens.

**HONEST LIMITATIONS:**
The access token is stored purely in memory, meaning a hard reload requires an immediate network request to silently refresh it, delaying the initial app paint.
*How I would improve this:* Server-Side Rendering (Next.js) to securely read the cookie and hydrate the app instantly.

---

### 2. Refresh Controller Null-User Fix
**WHAT IT DOES:**
Prevents the server from crashing if a valid refresh token belongs to a user that no longer exists in the database.

**HOW IT WORKS:**
1. User sends refresh request.
2. `authController.js` -> `refresh` decodes JWT.
3. `User.findById(decoded.id)` runs. If the user was deleted manually, it returns null.
4. An explicit `if (!user)` block catches this and returns 401, halting execution.

**KEY LOGIC EXPLAINED:**
```javascript
// server/controllers/authController.js
const user = await User.findById(decoded.id)
if (!user) {
  return res.status(401).json({ message: "User not found" })
}
```
*Checks if the user actually still exists in MongoDB before trying to read `user.refreshTokens`.*

**WHY THIS APPROACH:**
Failing fast. Without this check, accessing `user.refreshTokens` would throw a TypeError, causing a 500 error and potentially crashing the node process.
*Alternative not chosen:* Cascading deletes to ensure tokens are wiped (complex and doesn't handle direct DB manual deletions).

**WHAT IF...**
- **User deleted while logged in:** The next time their access token expires, the refresh hits this null check and they are logged out.
- **User disabled (but not deleted):** The current code doesn't explicitly check `user.isActive`, only `!user`. 
- **DB connection drops during findById:** Mongoose throws an error, caught by the outer `catch (error)`, returning a 401.

**LIKELY SCRUM QUESTIONS:**
- *Q: How did you fix the refresh crash?* A: Added a null check for the user document after JWT decode but before token array traversal.
- *Q: Does a deleted user stay logged in?* A: Only until their 15-minute access token expires.
- *Q: How are errors handled here?* A: Outer try/catch sends a 401 "Invalid or expired refresh token".
- *Q: What if the token format is mangled?* A: `jwt.verify` throws an error, jumping immediately to the catch block.

**HONEST LIMITATIONS:**
A deleted user can still use their access token for up to 15 minutes.
*How I would improve this:* Implement an API Gateway or Redis blocklist for instant access token revocation.

---

### 3. originalPrice Field in Product Model
**WHAT IT DOES:**
Adds an `originalPrice` field to the `Product` schema to display discounts (e.g., Strike-through pricing).

**HOW IT WORKS:**
1. Admin sets `price` and `originalPrice`.
2. Model saves it to MongoDB (`server/models/Product.js`).
3. Frontend fetches products and renders UI conditionally showing the discount.

**KEY LOGIC EXPLAINED:**
```javascript
// server/models/Product.js
originalPrice: { type: Number, min: 0 }
```
*Simple schema update ensuring the value cannot be negative.*

**WHY THIS APPROACH:**
Storing `originalPrice` allows the frontend to calculate the discount dynamically or display the original MSRP. 
*Alternative not chosen:* Storing `discountPercentage` only. Storing the raw price is safer for exact math.

**WHAT IF...**
- **Admin inputs negative price:** Mongoose `min: 0` validation fails, returning a 400 error.
- **originalPrice is less than price:** The model allows this, which is a logic flaw (admin error).
- **Field is omitted:** It's not `required: true`, so it defaults to undefined, which the frontend handles gracefully.

**LIKELY SCRUM QUESTIONS:**
- *Q: Why store originalPrice instead of discount %?* A: It avoids floating-point rounding errors when calculating exact cart totals.
- *Q: Is the originalPrice required?* A: No, only items on sale have it.
- *Q: What validates the price?* A: Mongoose schema `min: 0`.
- *Q: Does the backend calculate the discount?* A: We have a `discount` field, but UI can do math based on `originalPrice` vs `price`.

**HONEST LIMITATIONS:**
No validation ensures `originalPrice > price`.
*How I would improve this:* Add a pre-save Mongoose hook to enforce `originalPrice >= price`.

---

## PHASE 2: Cart, Auth State, & Protected Routes

### 1. Logout & Token Invalidation
**WHAT IT DOES:**
Clears the HTTP-only cookie and removes the specific refresh token hash from the user's MongoDB document, logging them out of *that specific device*.

**HOW IT WORKS:**
1. User clicks Logout.
2. API call to `/api/auth/logout`.
3. `authController.js` decodes the cookie, finds the user, filters out the current token hash from `user.refreshTokens`.
4. `res.clearCookie` removes the cookie.
5. Client `AuthContext.jsx` clears the local state.

**KEY LOGIC EXPLAINED:**
```javascript
// server/controllers/authController.js
const hash = hashToken(refreshToken);
user.refreshTokens = user.refreshTokens.filter(t => t.tokenHash !== hash);
await user.save();
res.clearCookie('refreshToken', ...);
```
*Identifies the exact session via the hashed token and removes it, leaving other devices logged in.*

**WHY THIS APPROACH:**
Device-specific logout. 
*Alternative not chosen:* Emptying the entire array (`user.refreshTokens = []`), which would forcefully log the user out of all their devices (phone, laptop) simultaneously.

**WHAT IF...**
- **User clears cookies manually:** They are locally logged out, but the token hash remains in the DB until it rotates out.
- **Logout fails due to DB error:** The `catch` block explicitly calls `res.clearCookie` anyway, so the user is still logged out locally.
- **User sends fake cookie:** `jwt.verify` fails, jumping to catch, which clears the local cookie.

**LIKELY SCRUM QUESTIONS:**
- *Q: How do you handle logout on the backend?* A: We remove the specific token hash from the DB and clear the HTTP-Only cookie.
- *Q: Does logging out here log me out of my phone?* A: No, we filter out only the current token hash.
- *Q: What if the DB crashes during logout?* A: We catch the error and still execute `clearCookie` so the frontend session ends.
- *Q: Why hash the token before filtering?* A: Because we store hashed tokens in the DB to prevent theft via DB dumps.

**HONEST LIMITATIONS:**
Access token remains valid until it expires natively (up to 15 mins).
*How I would improve this:* Shorten access token lifespan to 5 minutes.

---

### 2. Cart System (Zustand + MongoDB)
**WHAT IT DOES:**
Manages the user's shopping cart. Syncs state globally on the frontend using Zustand and persists it in MongoDB.

**HOW IT WORKS:**
1. User clicks "Add to Cart".
2. `cartStore.js` `addItem` calls `api.post('/cart')`.
3. `cartController.js` `addToCart` finds the `Cart` document. If item exists with same `productId` and `size`, increments quantity; else pushes new object.
4. Populates the product details and returns the updated cart.
5. Zustand state updates, re-rendering the UI.

**KEY LOGIC EXPLAINED:**
```javascript
// server/controllers/cartController.js
const existingItem = cart.items.find(
  (item) => item.product.toString() === productId && item.size === size
)
if (existingItem) {
  existingItem.quantity += quantity || 1
}
```
*Prevents duplicate rows for the same product+size combo, smartly incrementing quantity instead.*

**WHY THIS APPROACH:**
Using Zustand (`cartStore.js`) prevents prop-drilling and keeps UI instant. Storing in MongoDB allows persistent carts across devices.
*Alternative not chosen:* Storing cart purely in localStorage. Bad for cross-device e-commerce tracking.

**WHAT IF...**
- **Product deleted while in cart:** `populate('items.product')` returns null for that product. The frontend needs to handle null products.
- **User adds negative quantity:** `cartController.js` `updateCartItem` checks `if (!quantity || quantity < 1)` and returns 400.
- **Two identical requests simultaneously:** Race condition might create two cart documents if they hit before the first saves (though Mongoose `unique: true` on `user` will throw 11000 on the second).

**LIKELY SCRUM QUESTIONS:**
- *Q: Why use Zustand for the cart?* A: Lightweight, no boilerplate, great for global state that updates frequently.
- *Q: How do you handle a user adding the same item twice?* A: We match by `productId` AND `size` and increment quantity.
- *Q: Is the cart tied to the session or the user account?* A: User account. They can log in on mobile and see their desktop cart.
- *Q: What if the product goes out of stock?* A: Current logic doesn't check stock on add, which is a flaw to address at checkout.

**HONEST LIMITATIONS:**
Does not check `product.stock` when adding to cart.
*How I would improve this:* Check `Product.findById` stock limit before allowing `quantity += 1`.

---

### 3. Token Initialization on App Load
**WHAT IT DOES:**
When the React app mounts, it silently attempts to get a new access token using the HTTP-only cookie.

**HOW IT WORKS:**
1. `App.jsx` mounts. `AuthContext.jsx` runs a `useEffect`.
2. Makes a silent `api.post("/auth/refresh")` request.
3. If successful, sets `user` and `accessToken`, resolving `isLoading` to false.
4. If it fails, clears state and sets `isLoading` to false, rendering the unauthenticated app.

**KEY LOGIC EXPLAINED:**
```javascript
// client/src/context/authContext.jsx
restorePromise = api.post("/auth/refresh").finally(() => { restorePromise = null; });
```
*Uses a singleton `restorePromise` to prevent React strict mode double-mounting from spamming the refresh endpoint.*

**WHY THIS APPROACH:**
Provides seamless UX. The user doesn't see a "logged out" flash before the session restores.
*Alternative not chosen:* Forcing user to log in every time the browser closes.

**WHAT IF...**
- **Backend is down:** Axios throws error, catch block sets user to null, app loads logged out.
- **Cookie is expired:** Backend returns 401, catch block sets user to null.
- **Component remounts quickly:** The `restorePromise` check ensures we don't fire parallel refresh requests.

**LIKELY SCRUM QUESTIONS:**
- *Q: Why is there a loading spinner on initial load?* A: We pause rendering until we know if the user has a valid session.
- *Q: Why the `restorePromise` variable outside the component?* A: Prevents race conditions during React 18 Strict Mode double mounts.
- *Q: Does this block the main thread?* A: No, it's an asynchronous network request.
- *Q: Where does the token come from on mount?* A: The browser automatically attaches the `refreshToken` HTTP-Only cookie.

**HONEST LIMITATIONS:**
Slows down initial paint by exactly 1 network round trip.
*How I would improve this:* Server-Side Rendering (Next.js) to read the cookie and inject state into HTML directly.

---

### 4. Route Protection (`ProtectedRoute.jsx`)
**WHAT IT DOES:** Validates authentication state before rendering sensitive pages like `/profile` or `/cart`.
**HOW IT WORKS:** Checks `user` from `useAuth()`. If missing, uses `<Navigate to="/login" replace />`.

### 5. Standard Route Structure
**WHAT IT DOES:** Defines the core React Router setup in `App.jsx`.
**HOW IT WORKS:** `/login` and `/signup` are explicit page routes. (This fixed an earlier bug where `onClose` and `onSignupClick` props were undefined when they were treated strictly as modals).

### 6. Environment Configurations
**WHAT IT DOES:** Defines environment-specific settings.
**HOW IT WORKS:** `.env.example` tracks keys. `process.env.NODE_ENV === 'production'` dynamically enables the `secure: true` flag on refresh cookies to ensure they only transmit over HTTPS in prod.

### 7. Refresh Token Cap (Max 5 Sessions)
**WHAT IT DOES:** Prevents the database document from blooming infinitely if a user logs in thousands of times.
**HOW IT WORKS:** In `authController.js`, `addRefreshToken` limits the array to 5: `while (user.refreshTokens.length > 5) user.refreshTokens.shift();`. This evicts the oldest sessions automatically.

---

## PHASE 3: Validation, Security & Tooling

### 1. Zod Validation & Mongo Sanitize
**WHAT IT DOES:**
Validates incoming request bodies against strict schemas (Zod) and strips dangerous characters to prevent NoSQL injection (Sanitize).

**HOW IT WORKS:**
1. User submits signup.
2. `server/middleware/sanitize.js` recursively deletes keys starting with `$` or containing `.`.
3. `authController.js` runs `signupSchema.safeParse(req.body)`.
4. If invalid, returns 400 immediately.

**KEY LOGIC EXPLAINED:**
```javascript
// server/middleware/sanitize.js
if (key.startsWith('$') || key.includes('.')) { delete obj[key] }
```
*Prevents NoSQL injection by ensuring attackers cannot pass MongoDB operators like `{"email": {"$gt": ""}}`.*

**WHY THIS APPROACH:**
Zod provides type-safe, declarative validation. Custom sanitization is lighter than bringing in massive libraries if we just need to strip `$` and `.`.
*Alternative not chosen:* `express-validator` (requires more boilerplate and middleware chaining).

**WHAT IF...**
- **Attacker sends `{"$gt":""}` as password:** Sanitize middleware deletes the `$gt` key. The password field becomes undefined. Zod fails because password is required.
- **Name contains `<script>`:** Zod regex `/^[a-zA-Z0-9\s\-_]+$/` fails validation (blocks XSS).
- **Extremely large payload:** Not handled by Zod directly, relies on Express body parser limits.

**LIKELY SCRUM QUESTIONS:**
- *Q: How do you prevent NoSQL injection?* A: A custom middleware that recursively strips keys starting with `$` or containing `.`.
- *Q: Why Zod instead of Mongoose validation?* A: Zod stops bad data *before* it even reaches the controller or database layer.
- *Q: How do you prevent XSS in the name field?* A: Zod regex strictly limits names to alphanumeric, spaces, hyphens, and underscores.
- *Q: What does `safeParse` do?* A: It returns an object with `success: true/false` instead of throwing an exception that needs a try/catch.

**HONEST LIMITATIONS:**
Our custom `sanitize.js` mutates `req.query` and `req.body` directly, which is generally frowned upon.
*How I would improve this:* Use the official `express-mongo-sanitize` package for battle-tested edge cases instead of rolling our own.

---

### 2. Bcrypt Timing & Enumeration Fix
**WHAT IT DOES:**
Prevents attackers from knowing if an email exists in the database based on how long the login request takes.

**HOW IT WORKS:**
1. Login receives email/password.
2. If `User.findOne` returns null (user doesn't exist), the server still spends ~100ms computing a dummy bcrypt hash.
3. The response time is exactly the same whether the user exists or not.

**KEY LOGIC EXPLAINED:**
```javascript
// server/controllers/authController.js
if (!user) {
  await bcrypt.compare(password, '$2b$10$VWoys1Th9Igu9...');
} else {
  isMatch = await bcrypt.compare(password, user.password);
}
```
*Ensures the CPU-heavy bcrypt operation happens in BOTH branches.*

**WHY THIS APPROACH:**
Bcrypt is slow by design. Without this, invalid emails return in 10ms, while valid emails return in 100ms. Attackers can brute-force email lists.
*Alternative not chosen:* Random delays (less accurate and creates unpredictable latency).

**WHAT IF...**
- **Valid user logs in:** Normal bcrypt compare runs.
- **Invalid user logs in:** Dummy bcrypt compare runs.
- **Attacker brute forces emails:** Every request takes ~100ms, defeating timing attacks and slowing down the brute force.

**LIKELY SCRUM QUESTIONS:**
- *Q: Why is there a hardcoded hash in the login controller?* A: It's a dummy hash used to neutralize timing attacks for user enumeration.
- *Q: What is a timing attack?* A: Deducing information (like if an email exists) based on the server response time.
- *Q: Why use bcrypt?* A: It uses salt and a configurable cost factor to slow down brute force cracking.
- *Q: What happens if the DB is down?* A: `findOne` throws an error, we return 500.

**HONEST LIMITATIONS:**
The dummy string is hardcoded. If we change the salt rounds from 10 to 12 later, the dummy hash will be faster/slower than the real ones.
*How I would improve this:* Dynamically generate the dummy hash on server start based on the active cost factor.

---

### 3. Duplicate Signup Race Condition (11000)
**WHAT IT DOES:**
Handles the edge case where two users submit the same email at the exact same millisecond.

**HOW IT WORKS:**
1. `User.findOne({ email })` returns null for BOTH requests (race condition).
2. Both attempt `User.create()`.
3. MongoDB unique index catches the second save and throws error code `11000`.
4. Catch block checks `if (error.code === 11000)` and returns a clean 400 error instead of a 500 crash.

**KEY LOGIC EXPLAINED:**
```javascript
if (error.code === 11000) {
  return res.status(400).json({ message: 'Email already exist' });
}
```
*Relies on MongoDB's atomic constraints rather than just application logic.*

**WHY THIS APPROACH:**
Application-level checks (`findOne`) are subject to race conditions. DB-level unique indexes are mathematically bulletproof.
*Alternative not chosen:* Transaction locks (overkill for user creation).

**WHAT IF...**
- **Normal signup:** Works fine.
- **Double click signup button:** First succeeds, second hits `11000` catch block, returns clean UI error.
- **DB Unique Index missing:** The DB would save two users with the same email, breaking auth.

**LIKELY SCRUM QUESTIONS:**
- *Q: If we check `findOne` first, why do we need the 11000 catch?* A: To prevent race conditions if two requests slip past the `findOne` check at the same time.
- *Q: What is error 11000?* A: MongoDB's native error code for a duplicate key violation.
- *Q: Why not just return the error object to the frontend?* A: It leaks database structure and path names.
- *Q: How is the unique index created?* A: Via `unique: true` in the Mongoose User schema.

**HONEST LIMITATIONS:**
We return a generic "Email already exist", which technically facilitates user enumeration during signup.
*How I would improve this:* For maximum security, always return "If the data is valid, account is created" and require email verification.

---

### 4. Rate Limiting & Error Leak Removal
**WHAT IT DOES:**
`rateLimiter.js` restricts IP addresses from spamming endpoints. Error leak removal ensures `res.status(500).json({ error: err.message })` is replaced with safe, generic text.

**HOW IT WORKS:**
1. `authLimiter` limits to 5 requests / 15 mins.
2. Applied to `/login`, `/signup`, `/forgot-password`.
3. Catches inside controllers use `console.error(error)` for logs, but send `message: "Server Error"` to the user.

**KEY LOGIC EXPLAINED:**
```javascript
// server/middleware/rateLimiter.js
skip: (req) => process.env.NODE_ENV !== 'production'
```
*Disables the limiter during local development so developers don't get locked out while testing.*

**WHY THIS APPROACH:**
In-memory rate limiting (`express-rate-limit`) is easy to set up and protects against basic script kiddies.
*Alternative not chosen:* Redis rate limiting (adds infrastructural complexity, though better for multi-server setups).

**WHAT IF...**
- **Attacker spams login:** 6th attempt returns 429 Too Many Requests.
- **Server restarts:** In-memory rate limits are wiped clean.
- **Dev env:** `skip` function returns true, rate limits are bypassed.

**LIKELY SCRUM QUESTIONS:**
- *Q: Why is the rate limiter skipped in dev?* A: It's extremely annoying during UI testing to get blocked.
- *Q: Why remove `error.message` from 500 responses?* A: It can leak stack traces, folder paths, or database schemas to attackers.
- *Q: Is the rate limit per user or per IP?* A: Per IP, managed by `express-rate-limit`.
- *Q: What happens to rate limits if we scale to 3 Node servers?* A: The in-memory limiter fails. We would need a Redis store.

**HONEST LIMITATIONS:**
In-memory store resets on node reboot and doesn't share state across PM2 clusters.
*How I would improve this:* Switch to `rate-limit-redis`.

---

### 5. SMTP config & tls rejectUnauthorized:false
**WHAT IT DOES:**
Configures `nodemailer` to send emails via Gmail. Uses a risky TLS flag to bypass local certificate issues.

**HOW IT WORKS:**
1. Creates a transporter via `smtp.gmail.com`.
2. Uses App Passwords for authentication.
3. Sends HTML and plain-text fallbacks.

**KEY LOGIC EXPLAINED:**
```javascript
// server/utils/sendEmail.js
tls: { rejectUnauthorized: false }
```
*Tells Node to ignore SSL certificate validation errors.*

**WHY THIS APPROACH:**
Likely added during development because of a corporate proxy, antivirus (like Avast), or local strict SSL settings blocking outgoing connections to Gmail. (Brevo might have failed due to similar network blocks or domain reputation issues).
*Alternative not chosen:* Fixing the local CA certificates (harder).

**WHAT IF...**
- **Production deployment:** `rejectUnauthorized: false` allows Man-In-The-Middle (MITM) attacks where an attacker intercepts the SMTP connection and reads password reset links.
- **Gmail blocks IP:** Transporter throws error, caught and logged by controllers.
- **App Password revoked:** Nodemailer auth fails, emails silently fail (logged in console).

**LIKELY SCRUM QUESTIONS:**
- *Q: Why did Brevo fail and why switch to Gmail?* A: Brevo rejected emails due to missing DMARC/domain verification. Later, Gmail SMTP caused inbox reputation issues (landing in spam).
- *Q: What is `rejectUnauthorized: false` and is it safe?* A: It disables SSL cert checking. I used it to bypass local SSL interception/self-signed certs in dev. It is HIGHLY dangerous and must NOT go to production because it allows MITM attacks.
- *Q: How do you handle email failures?* A: The controllers catch email errors, log them, but STILL return 200/201 so the user flow isn't completely broken.
- *Q: How do you generate the plain text version?* A: Regex stripping HTML tags from the HTML version.

**HONEST LIMITATIONS:**
Gmail SMTP has severe sending limits (500/day) and will flag the app as spam quickly. `rejectUnauthorized` is a massive security flaw.
*How I would improve this:* Remove the TLS flag, buy a domain, and use AWS SES or Resend for production.

---

## PHASE 5: Admin Roles & Security 

### Admin Role Middleware
**WHAT IT DOES:**
Protects routes so only users with `role: 'admin'` can access them.

**HOW IT WORKS:**
1. Request hits `/api/admin/...`.
2. `verifyToken` middleware decodes JWT and attaches `req.user`.
3. `adminMiddleware` fetches user from DB, checks `if (user.role !== 'admin')`.
4. Rejects with 403 if not admin.

**KEY LOGIC EXPLAINED:**
```javascript
// server/middleware/adminMiddleware.js
const user = await User.findById(req.user.id);
if (!user || user.role !== 'admin') return res.status(403)
```
*Fetches fresh from DB instead of relying solely on the JWT payload, in case admin privileges were recently revoked.*

**WHY THIS APPROACH:**
DB lookup ensures real-time privilege checking.
*Alternative not chosen:* Storing `role` in JWT (faster, but if an admin is demoted, they keep privileges until token expires).

**WHAT IF...**
- **Normal user hits admin route:** DB check fails, returns 403.
- **Admin demoted mid-session:** Next request hits DB, fails role check, returns 403 instantly.
- **User manually changes local state to admin:** Frontend might show admin UI, but backend API will reject all requests with 403.

**LIKELY SCRUM QUESTIONS:**
- *Q: Why fetch the user from DB again in admin middleware?* A: To ensure instant revocation of admin rights if their role changes.
- *Q: How is the frontend protected?* A: `AdminProtectedRoute` in React Router checks `user?.role`.
- *Q: Can a user bypass the frontend UI?* A: Yes, via Postman, but the backend middleware stops them.
- *Q: What status code is returned?* A: 403 Forbidden.

**HONEST LIMITATIONS:**
Extra DB call per request slows down admin endpoints.
*How I would improve this:* Add Redis caching for user roles.

---

## ADDITIONAL SECTIONS

### A. ARCHITECTURE OVERVIEW
**Folder Structure:**
- `server/`: Express backend. 
  - `controllers/`: Core business logic (auth, cart, products).
  - `models/`: Mongoose schemas.
  - `routes/`: API endpoint definitions.
  - `middleware/`: Auth, Admin, Sanitize, Rate limits.
- `client/src/`: React frontend (Vite).
  - `api/`: Axios instances and Token store.
  - `components/`: Reusable UI.
  - `pages/`: Route-level views.
  - `store/`: Zustand state management (`cartStore.js`).
  - `context/`: React context (`authContext.jsx`).

**Request Lifecycle (Add to Cart):**
UI Click -> Zustand `addItem` -> Axios Interceptor (attaches JWT) -> Express `/cart` Route -> `authMiddleware` (verifies JWT) -> `cartController` (DB ops) -> MongoDB -> JSON Response -> Zustand updates state -> React re-renders Cart UI.

**Auth State Flow:**
Login -> API returns `accessToken` & sets `refreshToken` Cookie -> Context saves access token in memory -> Axios Interceptor attaches it to Headers -> on 401, Interceptor calls `/refresh` -> gets new token -> retries request.

### B. DATABASE MODELS
- **User:** `name`, `email`, `password`, `role`, `refreshTokens` (array of hashed tokens), verification/reset fields.
- **Product:** `name`, `price`, `originalPrice`, `department` (array), `sizes`, `stock`, `images`. Designed to handle complex filtering (sport, gender, dept).
- **Cart:** `user` (ObjectId, unique), `items` (array of subdocuments with `product`, `size`, `quantity`). Tied uniquely to a user.

### C. SECURITY SUMMARY TABLE

| Threat | Protection in Project | File Implemented |
| :--- | :--- | :--- |
| **XSS** | Zod Regex validation on inputs | `validators/authValidator.js` |
| **NoSQL Injection** | Recursive stripping of `$` and `.` keys | `middleware/sanitize.js` |
| **Timing Attacks** | Dummy bcrypt hash on invalid email | `controllers/authController.js` |
| **Brute Force** | `express-rate-limit` | `middleware/rateLimiter.js` |
| **Token Theft (DB)** | Refresh tokens are hashed before DB save | `controllers/authController.js` |
| **Token Theft (XSS)**| Refresh token in `httpOnly` cookie | `controllers/authController.js` |
| **Race Conditions** | MongoDB Unique Indexes (Code 11000) | `controllers/authController.js` |
| **Info Leakage** | Explicit `Server Error` overriding `err.message` | Multiple Controllers |

### D. BUG STORY LIST (Expanded)
1. **App crashes on refresh:** (See Phase 1) `user.refreshTokens` threw TypeError. Fix: `if (!user)` check.
2. **Duplicate Signup Race:** Two clicks = two identical accounts. Fix: MongoDB unique index 11000 check.
3. **Timing / User Enum:** Fake login took 10ms, real took 100ms. Fix: Dummy bcrypt hash.
4. **Cart Duplicate Rows:** Adding the same item twice created two rows. Fix: Array find matching `productId` AND `size` to increment quantity.
5. **Double Network Requests:** React 18 Strict Mode mounted `useEffect` twice. Fix: Singleton `restorePromise` outside component.
6. **Zombie Node Process (Port 5000):** Nodemon crashed but held the port. Fix: Used `taskkill /F /PID <id>` to free it up in Windows.
7. **Dotenv ES Module Load Order:** Imports evaluated before `import 'dotenv/config'`, breaking SMTP credentials (`EMAIL_USER` was undefined). Fix: Moved `import 'dotenv/config'` to the absolute top of `server.js`.
8. **DMARC / Gmail Sender Spoofing:** Brevo dropped emails because the from address was @gmail.com (DMARC). Later, Gmail SMTP caused inbox reputation issues (going to spam).
9. **Forgot Password Silent Failure:** Case-sensitive lookup (`Safeer@...` vs `safeer@...`) failed. Fix: Added `.toLowerCase().trim()` to `req.body.email`.
10. **NavBar Login Modal Leaking:** Login modal state stayed open across route changes. Fix: `useEffect` watching `location.pathname` inside `NavBar.jsx` (not Layout) to `setMenuOpen(false)`.
11. **Order History Field Mismatches:** Hardcoded mock array caused UI to break. `order.id` was mapped instead of `order._id`, and `cost` instead of `totalAmount`. Fix: Updated frontend maps to use real backend fields `order._id` and `order.totalAmount`.
12. **JWT Secret Mismatch:** `authMiddleware` checked `JWT_SECRET` while login signed with `JWT_ACCESS_SECRET`, causing immediate 401s on protected routes. Fix: Aligned both to use `process.env.JWT_ACCESS_SECRET`.
13. **Stored XSS in Name:** Users signed up with `<script>` tags rendering in NavBar. Fix: Zod regex validation blocking special chars.
14. **Error Message Leaks (11 places):** Mongoose validation errors returned field paths in 500 responses. Fix: Caught generic errors and returned hardcoded `"Server Error"`.
15. **NoSQL Injection:** Attackers could send `{"$gt": ""}`. Fix: Recursive custom sanitization middleware `sanitize.js` stripping `$` and `.`.
16. **Session Not Invalidated on Reset:** Resetting password didn't log out active sessions. Fix: `user.refreshTokens = []` added to reset password controller.

### E. TOP 5 TOUGH QUESTIONS
1. **Q: Why store the refresh token hash instead of the raw token in DB?**
   *A:* If the database is compromised, attackers cannot use the hashes to generate valid JWTs to steal sessions.
2. **Q: What happens if I manually change my role to 'admin' in local storage?**
   *A:* You might see the admin dashboard UI, but the API requests will fail with 403 because `adminMiddleware` re-checks your role against the Database.
3. **Q: Why is `tls: { rejectUnauthorized: false }` dangerous?**
   *A:* It disables SSL certificate validation, making the server vulnerable to Man-In-The-Middle attacks where SMTP traffic (passwords, reset links) can be intercepted.
4. **Q: How does the Axios Interceptor handle multiple concurrent requests when the token expires?**
   *A:* It uses an `isRefreshing` boolean flag and a `refreshQueue` array. Pending requests are suspended as Promises and resolved once the new token arrives.
5. **Q: Why does the password reset invalidate all other sessions?**
   *A:* We clear the `user.refreshTokens` array on reset. If an attacker had access and requested a reset, or if a user resets because they were hacked, all existing sessions are forcefully terminated.

### F. SPOKEN SUMMARIES

**2-Minute Summary:**
"For this E-Commerce project, I built a robust MERN stack architecture focusing heavily on security and state management. On the backend, I implemented a dual JWT system—access tokens in memory and rotating refresh tokens in HTTP-only cookies, with DB-level hashing to prevent token theft. I secured the API using Zod validation, custom NoSQL injection sanitizers, and neutralized timing attacks with dummy bcrypt hashes. The database relies on Mongoose with strict schemas, handling race conditions via atomic unique indexes. On the frontend, I used React with Zustand for instant, prop-drilling-free Cart state management, and an Axios interceptor that queues network requests silently in the background while tokens refresh. Finally, I built strict role-based access control where admin privileges are verified directly against the database on every sensitive request to ensure instant revocation."

**30-Second Summary:**
"I built a secure MERN e-commerce platform. It features stateless memory-based access JWTs with rotating HTTP-only refresh cookies, protected against XSS and timing attacks. State is managed globally via Zustand, and network reliability is ensured via a custom Axios interceptor for silent token renewals. The backend is fortified with Zod, rate limiting, and NoSQL sanitization."

---

## PHASE 4: User Profiles, Wishlists, & Search

### 1. User Profile & Edit Profile
**WHAT IT DOES:** Allows users to view their account dashboard and securely update their personal information.
**HOW IT WORKS:**
1. User navigates to `/profile`, frontend fetches data on mount.
2. When editing name, `Profile.jsx` sends a PATCH to `/api/profile`.
3. Backend `profileRoutes.js` validates via Zod `updateProfileSchema`.
4. Mongoose `User.findById` fetches the document, updates `user.name`, and saves it.
**KEY LOGIC EXPLAINED:**
```javascript
const user = await User.findById(req.user.id).select('-password -refreshTokens');
user.name = name;
await user.save();
```
*Explicitly assigning fields prevents mass-assignment vulnerabilities.*
**WHY THIS APPROACH:** 
Explicit assignment is safer than passing `req.body` to `findByIdAndUpdate`, which could allow attackers to inject fields like `role: 'admin'`.
*Alternative not chosen:* `findByIdAndUpdate` (shorter, but riskier without strict body filtering).
**WHAT IF...**
- **Mass assignment attempt:** The code only extracts `{ name }` from `result.data` after strict Zod validation. Extra fields are ignored.
- **Zod validation fails:** `safeParse` returns false, the backend safely extracts the error string and returns a 400.
- **User is deleted mid-session:** `findById` returns null, triggering a 404 response.
**LIKELY SCRUM QUESTIONS:**
- *Q: How did you prevent mass assignment?* A: By pulling only `name` from the validated Zod object and manually assigning it to the Mongoose document.
- *Q: Why use `.select('-password')` here?* A: To prevent the password hash from being sent back to the client upon save.
- *Q: What happens if Zod validation fails?* A: We use `.safeParse()` to avoid unhandled exceptions, passing the explicit error message back to the UI.
- *Q: Why is Profile.jsx so complex?* A: It acts as a unified dashboard covering overview, orders, and wishlists using tab state.
**HONEST LIMITATIONS:** No email update functionality yet, which would require a complex re-verification flow.

---

### 2. Wishlist System
**WHAT IT DOES:** Allows users to save up to 100 products for later purchase.
**HOW IT WORKS:**
1. User clicks the heart icon -> triggers `WishlistContext`.
2. POST `/api/wishlist/:productId` hits `wishlistRoutes.js`.
3. Mongoose `updateOne` uses `$addToSet` to add the ID.
4. GET request populates products but filters out null references.
**KEY LOGIC EXPLAINED:**
```javascript
await Wishlist.updateOne(
  { user: req.user.id },
  { $addToSet: { products: productId } },
  { upsert: true }
);
```
*Creates the wishlist document if it doesn't exist, and ensures unique products natively.*
**WHY THIS APPROACH:** 
`$addToSet` guarantees uniqueness at the DB level, preventing duplicates without a prior read step.
*Alternative not chosen:* Keeping wishlist array inside the `User` document (could cause the User document to hit the 16MB limit and slow down auth operations).
**WHAT IF...**
- **Product is deleted from DB after being wishlisted:** The GET route runs `wishlist.products.filter(p => p != null)` to safely hide null populated products from the UI.
- **User adds 101st item:** A manual check `if (wishlist.products.length >= 100)` throws a 400 error.
- **Invalid productId passed:** `mongoose.isValidObjectId(productId)` catches it and returns 400 before querying.
**LIKELY SCRUM QUESTIONS:**
- *Q: Why `$addToSet` instead of `$push`?* A: It guarantees uniqueness at the DB level, preventing the same item from appearing twice.
- *Q: What is `upsert: true`?* A: If the user doesn't have a wishlist document yet, MongoDB creates one automatically.
- *Q: How do you handle deleted products in wishlists?* A: Mongoose population returns `null` for missing refs. We filter those out before sending to the client.
- *Q: Why cap the list at 100?* A: To prevent document size bloating and slow population queries.
**HONEST LIMITATIONS:** We don't clean up deleted products automatically from the wishlist array in the DB (they are only hidden at runtime).

---

### 3. Order History
**WHAT IT DOES:** Converts a cart into a permanent order snapshot and displays it.
**HOW IT WORKS:**
1. Checkout calls `createOrder` -> validates user is verified.
2. Iterates over populated `Cart`, mapping to `Order` items.
3. Server calculates `totalAmount` to prevent spoofing.
4. `getOrders` fetches them based on ownership.
**KEY LOGIC EXPLAINED:**
```javascript
if (order.user.toString() !== req.user.id) {
  return res.status(403).json({ message: 'Not authorized' })
}
```
*Ensures users cannot view orders belonging to other accounts via ID enumeration.*
**WHY THIS APPROACH:** 
Calculating the total server-side and duplicating product data (name, price) creates an immutable snapshot.
*Alternative not chosen:* Trusting the frontend total (massive security flaw) or only saving product IDs (breaks if price changes later).
**WHAT IF...**
- **Client sends a manipulated total price:** Ignored entirely. The server reads `item.product.price` from the DB via population.
- **User tries to view another user's order:** The explicit ownership check catches the mismatch and returns 403.
- **Mock data bug (string totalAmount):** Solved in `Profile.jsx` via `typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount` to prevent a crash.
**LIKELY SCRUM QUESTIONS:**
- *Q: How do you prevent users from spoofing total amounts?* A: The client only sends the checkout command. The server calculates the total natively from DB prices.
- *Q: Why does the order item schema duplicate product name/price?* A: It creates a snapshot. If the product price changes next year, the historical order retains the price paid at the time.
- *Q: How do you ensure users only see their orders?* A: The `/orders` GET route explicitly queries `{ user: req.user.id }`.
- *Q: Why did `.toFixed()` crash previously?* A: Mock data was inserted as strings, so `.toFixed()` threw a TypeError on the frontend.
**HONEST LIMITATIONS:** No payment gateway integration yet; order creation is immediate.

---

### 4. Forgot / Reset Password
**WHAT IT DOES:** Allows account recovery via a secure, time-limited, single-use email link.
**HOW IT WORKS:**
1. `forgotPassword` generates `crypto.randomBytes(32)` -> hashes it -> stores hash in DB -> emails raw token.
2. User clicks link -> submits new password -> `resetPassword` hashes new password.
3. Clears token and `user.refreshTokens = []` to boot out hackers.
**KEY LOGIC EXPLAINED:**
```javascript
const rawToken = crypto.randomBytes(32).toString('hex');
const hashedToken = hashToken(rawToken);
```
*Generates a cryptographically secure token, but only stores the hash in the DB.*
**WHY THIS APPROACH:** 
Hashing the reset token in the DB ensures that if the database is leaked, attackers cannot use the tokens to take over accounts.
*Alternative not chosen:* Storing raw tokens (security risk) or using JWTs for reset (harder to invalidate instantly).
**WHAT IF...**
- **Email lookup is case-sensitive:** Fixed by `req.body.email?.toLowerCase().trim()` before querying.
- **Attacker enumerates emails:** The API returns "If an account exists, a reset link has been sent" for both success and failure (preventing enumeration).
- **Token expires:** `resetPasswordExpires: { $gt: Date.now() }` query fails, returning 400.
**LIKELY SCRUM QUESTIONS:**
- *Q: Why hash the reset token before saving?* A: Standard security practice; if the DB leaks, the reset tokens are useless to attackers.
- *Q: How do you prevent email enumeration?* A: By returning a generic success message whether the email was found or not.
- *Q: Why clear `refreshTokens` on reset?* A: If the account was compromised, resetting the password instantly kicks the attacker out of all active sessions.
- *Q: How do you generate the token?* A: Using Node's native `crypto.randomBytes(32)`.
**HONEST LIMITATIONS:** Concurrent forgot-password requests overwrite the previous token, invalidating the first email link immediately.

---

### 5. Email Verification
**WHAT IT DOES:** Ensures a user owns their email before allowing them to login or place orders.
**HOW IT WORKS:**
1. Same crypto generation as reset password, sent on signup.
2. User clicks link -> backend matches hash, sets `isVerified: true`, clears token.
**KEY LOGIC EXPLAINED:**
```javascript
if (!user.isVerified) {
  return res.status(403).json({ message: 'Please verify your email before logging in' });
}
```
*Placed in the `login` controller (`authController.js`), intercepting unverified users. `createOrder` (`orderController.js`) also acts as a secondary failsafe.*
**WHY THIS APPROACH:** 
Requires strict verification before granting any authenticated access. The frontend `Login.jsx` intercepts the 403 response and dynamically displays a "Resend verification email" button to improve UX for blocked users.
*Alternative not chosen:* Allowing unverified users to login and only blocking them at checkout (can lead to database bloat with fake unverified sessions).
**WHAT IF...**
- **User tries to login without verifying:** Backend returns a 403, and the frontend shows an error with a "Resend verification email" button.
- **User tries to order without verifying:** `createOrder` explicitly blocks it natively as a secondary failsafe.
- **Attacker spams resend verification:** Blocked by `authLimiter` (5 per 15 mins).
- **Token expires:** Handled via `$gt: Date.now()` check.
**LIKELY SCRUM QUESTIONS:**
- *Q: Does the user need to be verified to login?* A: Yes. Unverified users attempting to login receive a 403, triggering the Resend Verification button in the UI.
- *Q: How long does the verification token last?* A: 24 hours.
- *Q: How do you prevent spamming the resend route?* A: It is wrapped in the `authLimiter` middleware.
- *Q: Is the token securely stored?* A: Yes, hashed via `crypto.createHash` before saving.
**HONEST LIMITATIONS:** A user can still fill up the database with fake accounts without ever verifying.

---

### 6. Search Results
**WHAT IT DOES:** Provides keyword search across multiple product fields.
**HOW IT WORKS:**
1. NavBar submits to `/search?q=term`.
2. `SearchResultsPage.jsx` extracts query via `useSearchParams` and calls API.
3. Backend escapes regex chars, builds a multi-field `$or` query, applies pagination, and returns.
**KEY LOGIC EXPLAINED:**
```javascript
const sanitizedQuery = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const regex = new RegExp(sanitizedQuery, 'i');
```
*Escapes special regex characters to prevent Regex Denial of Service (ReDoS).*
**WHY THIS APPROACH:** 
Regex search is simple to implement in Mongoose without heavy external infrastructure.
*Alternative not chosen:* Atlas Search / Elasticsearch (too complex for this scale).
**WHAT IF...**
- **User searches for `.*`:** The regex escaping neutralizes the wildcard, treating it as literal characters, preventing catastrophic backtracking.
- **Empty query string:** Backend catches `!q || q.trim() === ''` and returns an empty array instantly.
- **No results:** Frontend displays a clean "No results found" state instead of a broken grid.
**LIKELY SCRUM QUESTIONS:**
- *Q: How did you implement search?* A: A case-insensitive `$regex` query searching across 5 fields using `$or`.
- *Q: Why is regex escaping necessary?* A: To prevent ReDoS and unexpected query behaviors if users input symbols.
- *Q: Is this search scalable?* A: For small catalogs, yes. For millions of rows, it requires collection scans and would need Atlas Search.
- *Q: How does the frontend read the URL?* A: Using `useSearchParams()` from React Router.
**HONEST LIMITATIONS:** Regex searches cannot use standard MongoDB indexes efficiently, resulting in collection scans.

---

### 7. Layout & NavBar Refactor
**WHAT IT DOES:** Wraps the application in a persistent Layout that conditionally renders navigation.
**HOW IT WORKS:**
1. `Layout.jsx` uses `useLocation` to check `path.startsWith('/community')`.
2. Renders `<NavBar>` conditionally.
3. Main content rendered via `<Outlet />`.
**KEY LOGIC EXPLAINED:**
```javascript
useEffect(() => {
  setMenuOpen(false);
}, [location.pathname]);
```
*Forces the mobile menu/modals to close automatically whenever the route changes.*
**WHY THIS APPROACH:** 
React Router's `Outlet` allows standard pages to share the Navbar without duplicating code.
*Alternative not chosen:* Manually importing `<NavBar />` into every single page component.
**WHAT IF...**
- **User opens mobile menu and clicks a link:** The `useEffect` on `location.pathname` guarantees the modal closes on route change, fixing a major "leaking state" bug.
- **User visits a dead URL:** `NotFound.jsx` renders inside `Layout`, keeping the Navbar accessible to return home.
- **NavBar transparent scroll:** Controlled via `isHome` and `alwaysVisible` props tracking `scrollY`.
**LIKELY SCRUM QUESTIONS:**
- *Q: Why use React Router's Outlet?* A: It allows us to define a consistent shell while swapping out the inner page components.
- *Q: Why is CommunityPage an exception?* A: It has a vastly different, immersive GSAP design that requires full screen real estate.
- *Q: How do you fix modals staying open after navigation?* A: Listening to route changes in a useEffect and forcing state to false.
- *Q: What happens on unknown routes?* A: The wildcard `*` route catches them and renders the 404 page.
**HONEST LIMITATIONS:** Tying NavBar transparency strictly to `path === '/'` is brittle if we add more landing pages later.

---

## PHASE 5: Admin Roles & Management

### 8. Product Management Routes
**WHAT IT DOES:** Admin-only API routes to create, update, and delete products.
**HOW IT WORKS:**
1. `AdminProducts.jsx` (at frontend route `/admin/products`) hits backend API `/api/products` -> backend checks `authMiddleware` THEN `adminMiddleware`.
2. Validates via Zod (`productSchema`).
3. Executes Mongoose operations.
**KEY LOGIC EXPLAINED:**
```javascript
router.post('/', authMiddleware, adminMiddleware, async (req, res) => ...)
```
*Middleware chaining ensures the user is logged in, and an admin, before ever parsing the payload.*
**WHY THIS APPROACH:** 
Modular middleware allows easy application of security layers per route.
*Alternative not chosen:* Checking role inside the controller (repetitive and prone to human error).
**WHAT IF...**
- **Non-admin calls DELETE:** `authMiddleware` passes, `adminMiddleware` rejects with 403.
- **Invalid price (e.g. -10):** Zod catches it first; if it slips by, Mongoose `min: 0` catches it.
- **Image array empty:** Default arrays kick in on the schema level.
**LIKELY SCRUM QUESTIONS:**
- *Q: Why is the middleware order important?* A: `authMiddleware` must decode the JWT and set `req.user` BEFORE `adminMiddleware` can check `req.user.role`.
- *Q: Who validates the product data?* A: Zod schema validates the request body before it touches Mongoose.
- *Q: Is this secure?* A: Yes, role checking happens server-side, verifying against the actual DB record.
- *Q: How does the client update the UI?* A: React triggers a refetch (`fetchProducts()`) after a successful save.
**HONEST LIMITATIONS:** No image upload handling yet; it expects raw URL strings.

---

### 9. Admin Dashboard Protection
**WHAT IT DOES:** Provides a secure frontend wrapper (`AdminProtectedRoute`) for admin views.
**HOW IT WORKS:**
1. Checks `user?.role === 'admin'`.
2. If not, redirects to `/`.
3. Wraps `AdminProducts` and `AdminOrders`.
**KEY LOGIC EXPLAINED:**
```javascript
if (user?.role !== 'admin') {
  return <Navigate to="/" replace />;
}
```
*Standard React Router protection pattern pushing unauthorized users out.*
**WHY THIS APPROACH:** 
It prevents unauthorized users from even downloading/mounting the admin components.
*Alternative not chosen:* Checking inside every single admin component.
**WHAT IF...**
- **User modifies localStorage to say they are admin:** They bypass the React check and see the UI, but all Axios requests to the API will fail with 403s.
- **Admin refreshes page:** `isLoading` flag ensures we don't prematurely redirect before session restores.
- **Unauthorized access attempt:** Kicked to homepage without history entry (`replace: true`).
**LIKELY SCRUM QUESTIONS:**
- *Q: Is the frontend check secure?* A: No frontend check is secure. It's purely for UX. Real security happens on the backend.
- *Q: Why use `replace` on Navigate?* A: It replaces the history stack so the user can't click "Back" into a protected route.
- *Q: How do you handle loading states?* A: Return a spinner if `isLoading` is true so auth context has time to resolve.
- *Q: What UI components do admins use?* A: Dedicated tables and modals for product/order management.
**HONEST LIMITATIONS:** Admin panel is basic and unoptimized for mobile viewing.

---

### 10. Order Management
**WHAT IT DOES:** Allows admins to view all orders across the platform and update shipping statuses.
**HOW IT WORKS:**
1. `getAllOrders` queries `Order.find({})`.
2. `.populate('user', 'name email')` attaches buyer info.
3. `updateOrderStatus` patches the `status` enum.
**KEY LOGIC EXPLAINED:**
```javascript
const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
if (!validStatuses.includes(status)) return res.status(400);
```
*Strict enum checking prevents admins from setting invalid DB statuses.*
**WHY THIS APPROACH:** 
Hardcoded validation arrays prevent database corruption.
*Alternative not chosen:* Relying solely on Mongoose enum validation (harder to handle errors cleanly).
**WHAT IF...**
- **Admin passes fake status:** `validStatuses.includes(status)` returns 400.
- **Database has 10,000 orders:** The `getAllOrders` query fetches all of them, crashing Node memory.
- **Order is deleted manually:** Admin routes don't support DELETE, but if deleted via DB, it just won't appear.
**LIKELY SCRUM QUESTIONS:**
- *Q: How do you protect buyer privacy in the admin view?* A: `.populate('user', 'name email')` specifically selects ONLY name and email, excluding password hashes.
- *Q: How does an order change status?* A: Through a PATCH request validating against an enum.
- *Q: Is there pagination on the admin orders list?* A: No, which is a significant flaw.
- *Q: What happens if an order status is invalid?* A: It's rejected by explicit array inclusion checking before hitting Mongoose.
**HONEST LIMITATIONS:** Total lack of pagination on `getAllOrders` will break the server at scale.

---

### B. DATABASE MODELS (Continued)
- **Wishlist:**
  - `user` (unique ObjectId, ref to User), `products` (array of ObjectIds, ref to Product).
  - *Why designed so:* Kept separate from the `User` model to prevent the User document from hitting MongoDB's 16MB limit if a user goes crazy with wishlists, and keeps auth queries fast.
- **Order:**
  - `user` (ObjectId), `items` (array of snapshots: product ref, name, price, size, quantity), `totalAmount`, `status` (enum).
  - *Why designed so:* The items array duplicates product names and prices. This is critical for e-commerce to maintain historical accuracy; if a product price changes next year, the historical order retains the exact price paid at checkout.

---

### D. BUG STORY LIST (Expanded)
1. **App crashes on refresh:** (See Phase 1) `user.refreshTokens` threw TypeError. Fix: `if (!user)` check.
2. **Duplicate Signup Race:** Two clicks = two identical accounts. Fix: MongoDB unique index 11000 check.
3. **Timing / User Enum:** Fake login took 10ms, real took 100ms. Fix: Dummy bcrypt hash.
4. **Cart Duplicate Rows:** Adding the same item twice created two rows. Fix: Array find matching `productId` AND `size` to increment quantity.
5. **Double Network Requests:** React 18 Strict Mode mounted `useEffect` twice. Fix: Singleton `restorePromise` outside component.
6. **Zombie Node Process (Port 5000):** Nodemon crashed but held the port. Fix: Used `npx kill-port 5000` to free it up (happened 3 times during dev).
7. **Dotenv ES Module Load Order:** Imports evaluated before `import 'dotenv/config'`, breaking DB connection. Fix: Moved `import 'dotenv/config'` to the absolute top of `server.js`.
8. **DMARC / Gmail Sender Spoofing:** Brevo rejected emails due to missing domain verification. Fix: Switched to Gmail SMTP with App Passwords.
9. **Forgot Password Silent Failure:** Case-sensitive lookup (`Safeer@...` vs `safeer@...`) failed. Fix: Added `.toLowerCase().trim()` to `req.body.email`.
10. **NavBar State Leaking:** Opening mobile menu on `/men`, clicking `/women`, menu stayed open. Fix: `useEffect` watching `location.pathname` to `setMenuOpen(false)`.
11. **Mock Data Order Crash:** Inserted mock orders had string `totalAmount`, causing `.toFixed(2)` to throw TypeError. Fix: Added `typeof order.totalAmount === 'number' ? ...`.
12. **`order.id` vs `order._id`:** Frontend mapped `order.id` (undefined), showing blanks in UI. Fix: Switched mapping to MongoDB's native `order._id`.
13. **JWT Secret Clash:** Using same secret meant stealing access token compromised refresh logic. Fix: Split into `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
14. **Stored XSS in Name:** Users signed up with `<script>` tags rendering in NavBar. Fix: Zod regex validation blocking special chars.
15. **Error Message Leaks (11 places):** Mongoose validation errors returned field paths in 500 responses. Fix: Caught generic errors and returned hardcoded `"Server Error"`.
16. **NoSQL Injection:** Attackers could send `{"$gt": ""}`. Fix: Recursive sanitization middleware stripping `$` and `.`.
17. **Session Not Invalidated on Reset:** Resetting password didn't log out active sessions. Fix: `user.refreshTokens = []` added to reset password controller.

---

### E. TOUGH QUESTIONS (Expanded)
*(1-5 in previous section)*
6. **Q: Why does `Profile.jsx` use `location.state?.tab`?** A: To allow links from other parts of the app (like clicking an order notification) to jump directly to a specific tab.
7. **Q: What is `upsert` in Mongoose?** A: Update or Insert. It creates the document if it doesn't exist, used in our Wishlist logic.
8. **Q: How does `useSearchParams` differ from `useParams`?** A: `useParams` gets path variables (e.g., `/products/:id`), `useSearchParams` gets query strings (e.g., `?q=shoes`).
9. **Q: What is a ReDoS attack?** A: Regular Expression Denial of Service. Prevented in our search by escaping special regex characters.
10. **Q: Why are images structured as `default`, `men`, and `women` arrays?** A: To allow dynamic rendering of models based on the category the user is viewing.
11. **Q: How does `helmet` secure the app?** A: It automatically sets HTTP response headers to protect against XSS, clickjacking, and sniffing.
12. **Q: Why use `crypto.randomBytes` instead of `Math.random()`?** A: `Math.random` is predictable and not cryptographically secure for password resets.
13. **Q: What happens if `express-mongo-sanitize` is bypassed?** A: Attackers could inject NoSQL operators to bypass authentication or extract data.
14. **Q: Why populate `user` with only `name email` in admin orders?** A: To prevent sending password hashes or refresh tokens to the admin UI.
15. **Q: What is the purpose of `Layout.jsx`?** A: It acts as a wrapper to persist the NavBar and Footer across route changes.
16. **Q: Why is the access token stored in memory instead of localStorage?** A: `localStorage` is accessible to any XSS script, memory (closures/state) is not.
17. **Q: How does Zustand compare to Redux?** A: Zustand is much lighter, has less boilerplate, and doesn't require wrapping the app in Providers.
18. **Q: What is mass assignment?** A: When an API blindly accepts all client data (like `role: admin`), prevented by explicit field extraction.
19. **Q: Why do we hash the refresh token in the database?** A: So that a read-only database leak doesn't instantly grant access to user sessions.
20. **Q: How does the Axios interceptor handle a 401?** A: It pauses the request, requests a new token, and retries the original request seamlessly.
21. **Q: Why use `bcrypt` over `sha256`?** A: `bcrypt` includes a salt and a work factor, making it resistant to rainbow tables and brute force.
22. **Q: What does `cookie-parser` do?** A: It parses the `Cookie` header and populates `req.cookies` with an object keyed by cookie names.
23. **Q: Why limit the wishlist to 100 items?** A: To prevent the MongoDB document from bloating and slowing down population queries.
24. **Q: What is the purpose of `express-rate-limit`?** A: To prevent brute-force attacks and DoS by restricting the number of requests per IP.
25. **Q: How does `mongoose.isValidObjectId` help?** A: It prevents CastErrors and crashes when a user passes an improperly formatted string to an endpoint.
26. **Q: Why is `httpOnly` important for cookies?** A: It prevents client-side JavaScript from reading the cookie, neutralizing XSS token theft.
27. **Q: What does `cors({ credentials: true })` do?** A: It allows the browser to send cookies in cross-origin requests.
28. **Q: Why use `Outlet` from React Router?** A: It acts as a placeholder for child routes to render within a parent Layout.
29. **Q: How does Lenis work?** A: It hooks into the browser'requestAnimationFrame to hijack the scroll event for smooth scrolling.
30. **Q: Why do we have a separate `/api/auth/refresh` route?** A: To exchange the long-lived HTTP-only cookie for a short-lived access token.

---

### G. WHAT-IF SCENARIOS TABLE

| Scenario | Exact Behavior in this Codebase |
| :--- | :--- |
| **Token expires mid-session** | Axios interceptor queues requests, hits `/refresh`, and retries. |
| **Two identical signups at same ms** | Mongoose `11000` error caught, clean 400 returned. |
| **Attacker steals & reuses refresh token** | Token rotation detects reuse, clears `user.refreshTokens`, kicks all sessions. |
| **User deleted while logged in** | Next `/refresh` hits `if (!user)` check and returns 401. |
| **Admin enters negative originalPrice** | Mongoose `min: 0` validation throws a 400. |
| **Product deleted while in cart** | `.populate` returns null; frontend handles it gracefully. |
| **Cart item added twice** | `find()` matches `productId`+`size` and increments quantity. |
| **Name contains `<script>`** | Zod regex `/^[a-zA-Z0-9\s\-_]+$/` fails, returns 400. |
| **Attacker sends `{"$gt":""}` as password** | `sanitize.js` strips the `$gt` key, Zod fails requirement. |
| **Attacker enumerates emails via login** | Dummy bcrypt hash ensures 100ms response time for all attempts. |
| **Admin route hit by user** | `adminMiddleware` checks DB role, returns 403 Forbidden. |
| **User opens menu, clicks link** | `useEffect` on `location.pathname` forces menu to close. |
| **Forgot password lookup mismatch** | `.toLowerCase().trim()` normalizes input before DB query. |
| **Mock order has string totalAmount** | `.toFixed(2)` protected by `typeof` check in React. |
| **User resets password while hacked** | `user.refreshTokens = []` boots hacker out of active sessions. |
| **User views another's order** | `if (order.user !== req.user.id)` returns 403. |
| **Admin sends fake order status** | `validStatuses.includes` returns 400 before DB hit. |
| **101st item added to wishlist** | `wishlist.products.length >= 100` returns 400. |
| **User searches for regex wildcard `.*`** | `replace` escapes to `\.\*`, treating it literally. |
| **App re-mounts in Strict Mode** | `restorePromise` singleton prevents double refresh network spam. |

---

### H. HONEST LIMITATIONS (THINGS I SHOULD NOT CLAIM)
*If grilled, I will proactively admit these flaws to build credibility:*
1. **Access token valid after logout:** The 15-minute JWT remains valid in memory until expiry, even if the DB token is wiped.
2. **No pagination in Admin Orders:** `getAllOrders` fetches everything at once, which will crash the server at scale.
3. **Gmail SMTP is Dev-Only:** Hardcoded Gmail with App Passwords will hit limits (500/day) and get flagged as spam instantly.
4. **TLS rejectUnauthorized: false:** This is a massive security flaw allowing MITM attacks and MUST NOT go to production.
5. **Rate Limiter skipped in Dev:** `skip: (req) => process.env.NODE_ENV !== 'production'` means we have no rate limiting locally.
6. **Email Deliverability Unsolved:** We have no SPF/DKIM/DMARC setup, so emails will likely hit spam folders.
7. **No Automated Tests:** The codebase lacks Jest/Cypress coverage.
8. **CORS/Helmet status:** Helmet is installed but using default configs; CORS is hardcoded to localhost.
9. **Cart Stock Checking:** Adding to cart does not verify against `product.stock` limits.
10. **In-Memory Rate Limiter:** Resets on server restart and doesn't work across PM2 clusters.
