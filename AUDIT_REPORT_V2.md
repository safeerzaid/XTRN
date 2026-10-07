# XTRN Project Audit Report V2

## 1. Executive Summary
**Overall Completion:** ~75%
**Launch-Readiness Verdict:** **Almost Ready (Needs Security & Config Fixes)**

XTRN is a visually impressive project with a solid core. The webhook implementation, atomic stock handling, and cron jobs are advanced features that look great on a resume. However, it currently fails launch readiness due to a critical email verification bypass, missing production frontend proxy configuration (which will break auth cookies on Vercel), a missing admin users page, and NoSQL injection vulnerabilities. 

**Top 7 Reasons for Verdict:**
1. Login completely bypasses email verification (commented out in code).
2. Missing `vercel.json` will cause 404s on refresh and break auth cookies (cross-site blocking).
3. The README contains unmerged git conflict markers and outdated roadmaps.
4. `GET /api/products` is vulnerable to NoSQL injection and lacks pagination (unbounded query).
5. The Admin panel is missing the User Management page entirely.
6. "Community Club" and footer links are fully hardcoded and lead nowhere (looks fake to recruiters).
7. The database is missing critical indexes (category, search, department) for performance.

**Scores (out of 10):**
- Features: 7/10
- Security: 6/10
- Payments Reliability: 9/10
- Code Quality: 8/10
- UI/UX: 9/10
- Deploy Readiness: 5/10
- Portfolio Value: 8/10

---

## 2. Regression Table (Part 2)

| Item | Verdict | Evidence |
|------|---------|----------|
| 1. Payment Webhook | **FIXED** | `server.js:61` mounted before `express.json()`. `paymentRoutes.js:6` uses `express.raw()`. |
| 2. Webhook Atomic Update | **FIXED** | `paymentController.js:34` updates atomically using `paymentStatus: 'pending'` guard. |
| 3. verifyPayment Fallback | **FIXED** | `orderController.js:233` atomic update, line 247 throws 409, clears cart correctly. |
| 4. Stock Decrement & Restore | **FIXED** | `orderController.js:45` uses `$gte`. `stockUtils.js:14` safely restores with `$inc`. |
| 5. Cron stale-orders | **FIXED** | `cancelStaleOrders.js:8` uses 30-min threshold, targets Razorpay, atomic cancel. |
| 6. Emails | **FIXED** | `orderEmail.js` escapes HTML, uses `order.totalAmount`. Never throws on error. |
| 7. Email Verification | **BROKEN** | `authController.js:123` states `// Email verification check removed as per user request`. Unverified users can log in! |
| 8. Admin Product UI | **PARTIAL** | `productValidator.js:24` converts empty to null. But `ProductInfo.jsx:73` does not compute discount dynamically; it blindly applies strikethrough if `originalPrice != null`. |
| 9. Currency (INR only) | **FIXED** | DB script confirms prices are valid INR integers (e.g., 349, 999). No USD or $ in UI strings. |
| 10. Production Config | **FIXED** | `cookieOptions.js:6` correctly configures secure cookies. `server.js:34` trusts proxy. |
| 11. Security Hardening | **FIXED** | `rateLimiter.js` active on auth. `server.js` handles 404/500 JSON without leaking stacks. |
| 12. UI Fixes | **FIXED** | `ZoomImage.jsx:10` ignores touch, uses RAF. `ProductListingPage.jsx:249` hides gender filter correctly. |

---

## 3. Feature Table (Part 3)

| Feature | Verdict | Evidence | What is Missing |
|---------|---------|----------|-----------------|
| Auth | **PARTIAL** | `authController.js` handles JWT rotation well. | Email verification is completely bypassed at login. |
| Products | **PARTIAL** | `ProductListingPage.jsx` handles filters. | Search query limit exists, but main `GET /products` has no pagination. |
| Cart & Wishlist | **DONE** | Contexts and models exist, orphaned products handled nicely. | - |
| Checkout & Orders | **DONE** | COD & Razorpay implemented, stock atomic limits. | - |
| Cron & Emails | **DONE** | `cancelStaleOrders.js`, `orderEmail.js`. | - |
| Admin Panel | **MISSING** | `AdminProducts.jsx` & `AdminOrders.jsx` exist. | `AdminUsers.jsx` does not exist anywhere in the codebase. |
| Profile | **DONE** | `Profile.jsx` allows name & password change. | - |
| Community Club | **FAKE** | `CommunityPage.jsx` exists but no backend. | Frontend-only components with hardcoded data. No API routes. |
| Static Pages | **FAKE** | `Footer.jsx:21` | Footer links are just `<span>` elements with `hover:underline`. No actual pages exist. |

---

## 4. Findings Table

| ID | Severity | Area | File:Line | Problem | How to reproduce | Suggested Fix |
|---|---|---|---|---|---|---|
| 1 | **High** | Auth | `authController.js:123` | Email verification bypassed at login. | Signup with dummy email, then instantly login. | Add `if (!user.isVerified) return res.status(403)...` in login. |
| 2 | **High** | Security | `productRoutes.js:61` | NoSQL Injection & Unbounded Query on `GET /api/products`. | Send `?category[$ne]=null` | Destructure query params strictly, add `.limit(100)` to `Product.find()`. |
| 3 | **High** | Deploy | `client/vercel.json` | Missing vercel config will break cookies and routing. | Refresh page on Vercel deployment -> 404 error. | Create `vercel.json` with API rewrites to bypass cross-site cookie limits. |
| 4 | **Medium** | Config | `README.md:62` | Unresolved Git conflict markers and outdated roadmap. | Open README on GitHub. | Clean up conflict markers and rewrite roadmap to reflect completion. |
| 5 | **Medium** | Security | `server/package.json` | Vulnerable `nodemailer` and `proxy-addr` packages. | Run `npm audit`. | Update dependencies using `npm audit fix`. |
| 6 | **Low** | UI/UX | `Login.jsx:136` | Double submit possible because submit button isn't disabled during API call. | Click "Log In" rapidly 5 times. | Add `isSubmitting` state and disable button. |

---

## 5. Needs Manual Verification

1. **Production Cookies on Safari:** Since `sameSite: none` is blocked by default in Safari and Brave, manually test logging in on an iPhone once deployed to ensure the session sticks (this requires the Vercel rewrite fix).
2. **Webhook Idempotency:** Manually trigger `payment.captured` twice from the Razorpay dashboard for the same order and verify the stock is not decremented twice and emails are not sent twice.
3. **Empty Admin Search:** Search for an empty string in the Admin products table to ensure it doesn't crash or hang the page.

---

## 6. Prioritized Fix List

**P0 (Before Deploy)**
1. Fix login email verification bypass.
2. Add `vercel.json` with rewrite rules for SPA fallback and API proxying.
3. Fix NoSQL injection and unbounded query in `GET /api/products`.
4. Clean up `README.md` conflict markers and update the project description.

**P1 (Before Sharing Link on Resume)**
5. Implement or remove the "Admin Users" link so it doesn't look like a broken app.
6. Replace hardcoded `<span>` footer links with actual routes (even if they point to a simple "Coming Soon" or actual static pages).
7. Add database indexes to `Product.js` (gender, category, department).
8. Add a loading state to `Login.jsx` to prevent double-submissions.

**P2 (Nice to Have)**
9. Calculate discount dynamically in `ProductInfo.jsx` instead of relying on the DB field.
10. Fix image sizes (current assets are up to 2MB).

---

## 7. Prompts for Top 8 Fixes

**Prompt 1 (Email Verification Bypass)**
> In `server/controllers/authController.js`, inside the `login` function, the email verification check is currently commented out around line 123. Please add back the logic to block unverified users. Return a 403 status with `message: "Please verify your email to log in."` right before the access token is generated. Do not change anything else. Verify by checking if unverified users are rejected.

**Prompt 2 (Vercel SPA and Proxy)**
> Create a new file `client/vercel.json`. Configure it to proxy `/api/(.*)` to `https://xtrn-backend.onrender.com/api/$1` and route all other traffic `/(.*)` to `/index.html` for SPA fallback. Next, in `client/src/api/axios.js`, change the `baseURL` to strictly `/api` (remove VITE_API_URL completely). Do not change anything else. Verify by building the frontend.

**Prompt 3 (NoSQL Injection & Unbounded Queries)**
> In `server/routes/productRoutes.js`, the `GET /api/products` endpoint passes raw query strings to the filter. Ensure `department`, `category`, `section`, and `subcategory` are explicitly cast to strings using `String(req.query.category)` before adding them to the filter object. Also, append `.limit(100)` to `Product.find(filter)`. Do not change anything else. Verify by reviewing the query construction.

**Prompt 4 (README Cleanup)**
> Edit `README.md`. Remove the git conflict markers (<<<<<<<, =======, >>>>>>>). Update the "Roadmap" section to check off React Router, Cart, Authentication, Checkout, and Admin Panel. Add a section specifying that Community Club is a frontend-only design concept. Do not change anything else. Verify by checking markdown preview.

**Prompt 5 (Admin Users Page)**
> The codebase is missing `AdminUsers.jsx` but it seems to be expected. Please create a basic `client/src/pages/admin/AdminUsers.jsx` that simply fetches all users from a new `/api/admin/users` endpoint and displays their Name, Email, and Role in a table. Do not change anything else.

**Prompt 6 (Fake Footer Links)**
> In `client/src/components/layout/Footer.jsx`, the footer links are `<span>` tags that look clickable but do nothing. Change all of them to `<Link to="/not-found">` (or a similar valid dummy route) so they behave like real links for recruiters clicking around. Do not change anything else. Verify by hovering over links in the UI.

**Prompt 7 (Database Indexes)**
> In `server/models/Product.js`, add `index: true` to the `gender`, `category`, and `department` fields to optimize database queries. Add a text index for `name` and `brand` at the bottom of the schema. Do not change anything else. Verify the schema compiles correctly.

**Prompt 8 (Login Double Submit)**
> In `client/src/components/Login.jsx`, add a `const [isSubmitting, setIsSubmitting] = useState(false)` state. Set it to true when `handleLogin` starts and false in the `finally` block. Disable the submit button and change its text to "Logging in..." when `isSubmitting` is true. Do not change anything else. Verify by checking the button state during API calls.

---

## 8. Deployment Plan (Atlas, Render, Vercel)

**Step 1: MongoDB Atlas (Database)**
- Create a cluster and set Network Access to `0.0.0.0/0`.
- Create a DB user and copy the connection string.
- *Env Vars:* `MONGO_URI`

**Step 2: Render (Backend)**
- Create a new "Web Service" and connect your GitHub repo.
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node server.js`
- *Env Vars needed:* `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (set to your Vercel URL without a trailing slash), `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `GMAIL_USER`, `EMAIL_APP_PASSWORD`, `NODE_ENV=production`.
- *Test:* Visit your Render URL `/api/health` and expect `{"status":"ok"}`.

**Step 3: Razorpay Webhook**
- In Razorpay Dashboard, add a webhook pointing to `https://<your-render-url>.onrender.com/api/payments/webhook`.
- Select events: `payment.captured` and `payment.failed`.
- Set a custom secret, and paste it into your Render `RAZORPAY_WEBHOOK_SECRET`.

**Step 4: Vercel (Frontend)**
- Ensure Prompt 2 (the `vercel.json` file) is committed to your repo.
- Create a new Vercel project and connect the repo.
- Root Directory: `client`
- Framework Preset: `Vite`
- Build Command: `npm run build`, Output Directory: `dist`.
- *Env Vars needed:* None (since the proxy handles `/api`).
- *Test:* Open the Vercel URL. Refresh a page like `/products` to ensure SPA fallback works, and test login to ensure cookies are set via the proxy.

**Step 5: Keep-Alive (Cron Job Fix)**
- Render's free tier spins down after 15 minutes of inactivity, which completely pauses the Node-Cron job (`cancelStaleOrders.js`).
- Setup a free account on UptimeRobot and ping your `https://<your-render-url>.onrender.com/api/health` endpoint every 10 minutes to keep the server awake.

---

## 9. Portfolio and Interview Value

**First 2 Minutes (Recruiter View):**
- **Looks Fake:** The git conflict markers in the README, the non-clickable footer links, and the absence of a real user management table.
- **Looks Impressive:** The GSAP animations, the hover zoom on the PDP, and the clean Tailwind design immediately signal a premium build.

**8 Interview Questions & Answers:**
1. **Q:** Why did you use `express.raw()` for the webhook?
   **A:** Razorpay calculates its HMAC signature using the raw, unparsed payload bytes. If `express.json()` parses it first, the bytes shift slightly and the signature validation fails.
2. **Q:** How do you handle stock race conditions?
   **A:** I use an atomic MongoDB `$inc` update with a `$gte` guard (`stock: { $gte: quantity }`). This ensures the DB itself prevents overselling during concurrent checkouts.
3. **Q:** How did you handle the cross-site cookie issue for auth?
   **A:** Initially, I used `sameSite: none`, but Safari blocks this. I solved it by configuring a Vercel rewrite to proxy `/api` requests to Render, making cookies first-party context.
4. **Q:** What happens if the backend crashes while processing an order?
   **A:** I implemented a rollback array. If an item fails, it iterates through the `decremented` array and uses `$inc` to safely restore the stock before returning a 500 error.
5. **Q:** Why use Node-Cron for stale orders instead of a webhook?
   **A:** If a user abandons the Razorpay checkout tab, Razorpay never sends a webhook. Cron acts as a garbage collector to reclaim reserved stock after 30 minutes.
6. **Q:** Why is `verifyPayment` returning 409 sometimes?
   **A:** It’s an idempotency check. If the webhook already processed the payment and marked it `paid`, the frontend fallback call receives a 409 to prevent duplicate emails or logic execution.
7. **Q:** How did you optimize the frontend images?
   **A:** *(Be honest)* Currently, images are quite large (2MB+). My next step is to implement a CDN like Cloudinary or use Vite's image optimization plugins to serve WebP formats.
8. **Q:** How did you prevent NoSQL injection in the login?
   **A:** I use Zod for strict schema validation on the incoming request body, ensuring `email` is purely a string, and a custom sanitize middleware to strip any keys starting with `$`.
