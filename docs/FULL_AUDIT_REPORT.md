# XTRN — Full Repository Audit and Payment Integration Readiness

### A. Executive summary
The XTRN project has successfully established a robust foundational architecture with strong security practices (e.g., token hashing, secure cookies, Zod validation). Authentication, cart management, and user profiles are functionally complete. However, the system is not yet production-ready. The payment integration is entirely absent (0%), and critical gaps like the lack of inventory tracking (stock decrementing) block launch. Some optional features (like pagination on the main product listing and Cloudinary hosting) are missing but can be deferred. The immediate focus must be stock management, followed by integrating Razorpay.

### B. Architecture map
| Subsystem | Actual Files | Current Responsibility | External Dependency |
|---|---|---|---|
| Frontend Framework | `client/package.json`, `client/src/App.jsx` | React SPA using Vite, React Router DOM, Zustand (state). | React, Zustand, React Router |
| Backend API | `server/server.js`, `server/routes/*` | Express API providing REST endpoints. | Express, Node.js |
| Database/Models | `server/models/*`, `server/config/db.js` | MongoDB data layer via Mongoose. | MongoDB, Mongoose |
| Authentication | `server/controllers/authController.js`, `server/utils/token.js` | JWT based auth, refresh token rotation, bcrypt hashing. | bcryptjs, jsonwebtoken |
| Email Service | `server/utils/sendEmail.js` | Transactional emails for auth via Nodemailer. | Nodemailer (SMTP) |
| Validation | `server/validators/*` | Zod schema validation for req payloads. | Zod |

### C. Feature audit
| Feature | Reported status | Implementation status | Runtime verification | File:line evidence | Gap or finding |
|---|---|---|---|---|---|
| JWT_SECRET to JWT_ACCESS_SECRET correction | Complete | Complete by inspection | Not run | `server/utils/token.js` | Secrets are used correctly. |
| Login stores accessToken in localStorage | Complete | Complete by inspection | Not run | `client/src/components/Login.jsx` | Local storage is used for access token. (Known XSS tradeoff). |
| Refresh controller null-user fix | Complete | Complete by inspection | Not run | `server/controllers/authController.js:218` | User existence is checked before hashToken comparison. |
| Removed authValidator hardcoded safeParse call | Complete | Complete by inspection | Not run | `server/controllers/authController.js:22,117` | `safeParse(req.body)` is used dynamically. |
| Removed unused string import from User model | Complete | Complete by inspection | Not run | `server/models/User.js:1` | Clean Mongoose import only. |
| Standalone login/signup route crashes fixed | Complete | Complete by inspection | Not run | `client/src/components/Login.jsx` | Callbacks check for existence/props properly. |
| Product originalPrice field added | Complete | Complete by inspection | Not run | `server/models/Product.js:28` | Schema includes `originalPrice`. |
| Logout | Complete | Complete by inspection | Not run | `server/controllers/authController.js:278` | Clears refresh tokens and invalidates cookie. |
| Cart model, endpoints, state, and page | Complete | Complete by inspection | Not run | `server/controllers/cartController.js:1` | Does not validate available stock before adding. |
| Auth initialization through refresh | Complete | Complete by inspection | Not run | `server/controllers/authController.js:201` | Refresh handles state appropriately. |
| ProtectedRoute | Complete | Complete by inspection | Not run | `client/src/components/ProtectedRoute.jsx` | UI guard exists. Backend middleware independently verified. |
| Zod login validation | Complete | Complete by inspection | Not run | `server/controllers/authController.js:117` | Validation explicitly enforced. |
| Auth rate limiting | Complete | Complete by inspection | Not run | `server/middleware/rateLimiter.js:3` | authLimiter applied to sensitive routes. |
| Refresh-token rotation and token cap | Complete | Complete by inspection | Not run | `server/controllers/authController.js:13` | Capped at 5 tokens. Rotates correctly. |
| .env.example | Complete | Complete by inspection | Not run | `server/.env.example` | Contains standard placeholders. |
| Input sanitization | Complete | Complete by inspection | Not run | `server/middleware/sanitize.js:13` | Recursively strips `$` and `.` keys. |
| NODE_ENV and secure-cookie handling | Complete | Complete by inspection | Not run | `server/controllers/authController.js:80` | `secure: process.env.NODE_ENV === 'production'` |
| EMAIL_USER / EMAIL_PASS configuration | Complete | Complete by inspection | Not run | `server/utils/sendEmail.js:9` | Uses standard Nodemailer SMTP. (Brevo not explicitly SDK'd, just SMTP). |
| User Profile page | Complete | Complete by inspection | Not run | `server/routes/profileRoutes.js:9` | Strips password/refresh tokens securely. |
| Edit Profile name | Complete | Complete by inspection | Not run | `server/routes/profileRoutes.js:23` | Validates and specifically assigns `user.name` only. |
| Wishlist | Complete | Complete by inspection | Not run | `server/routes/wishlistRoutes.js:51` | Limits to 100 items. Filters null products. |
| Order History | Complete | Complete by inspection | Not run | `server/controllers/orderController.js:63` | Real data fetched and populated. |
| Forgot/Reset Password | Complete | Complete by inspection | Not run | `server/controllers/authController.js:362` | Hashes token, invalidates ALL sessions post-reset. |
| Signup email verification | Complete | Complete by inspection | Not run | `server/controllers/authController.js:414` | Expiry checked, verified status updated. |
| Search Results page | Complete | Complete by inspection | Not run | `server/routes/productRoutes.js:69` | Implements RegExp search and pagination natively. |
| Admin role middleware | Complete | Complete by inspection | Not run | `server/middleware/adminMiddleware.js:5` | Verifies DB role dynamically. |
| Admin product update/delete routes | Complete | Complete by inspection | Not run | `server/routes/productRoutes.js:151` | Guarded by admin middleware. |
| Admin product dashboard | Complete | Unclear | Not run | `client/src/pages/admin/AdminProducts.jsx` | Exists in client routes, specific functionality not deeply verified. |
| Admin order management | Complete | Unclear | Not run | `server/controllers/orderController.js:106` | Backend updateOrderStatus allows specific status transitions. |

### D. Prioritized findings
| ID | Severity | Feature | Evidence | Failure scenario | Recommended fix | Blocks payment or launch? |
|---|---|---|---|---|---|---|
| 1 | Critical | Inventory | `server/controllers/orderController.js:46` | Infinite purchases possible. Stock is never checked or decremented. | Add stock decrementing in order creation logic via transaction. | Yes (Payment/Launch) |
| 2 | High | Payment bypass | `server/controllers/orderController.js:46` | User can send `paymentMethod: 'razorpay'` and receive a confirmed order without a payment step. | Return `razorpayOrderId` and set `paymentStatus: 'pending'`, do not finalize order. | Yes (Payment) |
| 3 | Medium | Duplicate Orders | `server/controllers/orderController.js` | Double-clicking submit creates duplicate orders and clears cart concurrently. | Implement idempotency keys or frontend debouncing. | Yes (Launch) |
| 4 | Medium | CORS Hardcoding | `server/server.js:19` | Origin is hardcoded to localhost. | Use `process.env.CLIENT_URL` for CORS origins. | Yes (Launch) |
| 5 | Low | Product Pagination | `server/routes/productRoutes.js:14` | The main `/api/products` list query lacks pagination. | Implement skip/limit like the search endpoint. | No |

### E. Existing payment work to reuse
| Component | Existing file or endpoint | Current behavior | Keep / Extend / Replace | Reason |
|---|---|---|---|---|
| Order Model | `server/models/Order.js` | Defines fields cleanly | Extend | Add `razorpaySignature` and `paidAt`. |
| Checkout UI | `client/src/pages/CheckoutPage.jsx` | Submits COD properly | Extend | Add Razorpay modal invocation. |
| Order route | `server/controllers/orderController.js` | Secure price calculation | Extend | Needs stock decrementing and Gateway initiation. |

### F. Payment integration plan
1. **Fix Inventory/Stock Decrementing**
   - **File:** `server/controllers/orderController.js`
   - **Change:** In `createOrder`, check if `product.stock >= quantity`. If valid, decrement stock atomically.
   - **Dependency:** None.
   - **Acceptance:** Cannot order more than available stock; stock drops post-order.

2. **Configure Razorpay Integration**
   - **File:** `server/package.json`, `server/.env`
   - **Change:** `razorpay` is already in package.json. Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
   - **Dependency:** Step 1.
   - **Acceptance:** SDK initializes successfully.

3. **Backend Order Creation (Razorpay)**
   - **File:** `server/controllers/orderController.js`
   - **Change:** If `paymentMethod === 'razorpay'`, call Razorpay API (`razorpay.orders.create`). Return `razorpayOrderId` and order details instead of immediately concluding.
   - **Dependency:** Step 2.
   - **Acceptance:** API returns a provider order ID.

4. **Frontend Razorpay Modal**
   - **File:** `client/src/pages/CheckoutPage.jsx`
   - **Change:** Load Razorpay script dynamically. On `createOrder` success, if `paymentMethod === 'razorpay'`, open Razorpay modal.
   - **Dependency:** Step 3.
   - **Acceptance:** User can complete payment in modal.

5. **Payment Verification Webhook**
   - **File:** `server/routes/orderRoutes.js`, `server/controllers/orderController.js`, `server/server.js`
   - **Change:** Add `express.raw` parser before `express.json` for webhook route. Add `verifyPayment` webhook handler to validate `x-razorpay-signature`. Update `paymentStatus` to 'paid'.
   - **Dependency:** Step 3.
   - **Acceptance:** Legitimate webhooks mark orders as paid; invalid ones are rejected.

6. **Order Confirmation Emails**
   - **File:** `server/utils/sendEmail.js`, `server/controllers/orderController.js`
   - **Change:** Send an email upon COD order completion and upon successful Razorpay webhook capture.
   - **Dependency:** Step 5.
   - **Acceptance:** User receives a formatted email upon successful purchase.

### G. Test matrix
| Scenario | Test level | Expected outcome | Existing coverage | Missing work |
|---|---|---|---|---|
| Successful COD checkout | E2E | Order pending, stock drops, cart clears | Partial | Stock tracking |
| Tampered price | API | Server relies on DB prices | Complete | None |
| Insufficient stock | API | 400 Bad Request, stock unchanged | Missing | Controller logic |
| Valid Signature Webhook | API | Order marked 'paid', email sent | Missing | Webhook logic |
| Invalid Signature Webhook | API | 400 Bad Request | Missing | Webhook logic |
| Duplicate Webhook | API | Ignored/200 OK | Missing | Webhook logic |

### H. Updated roadmap
**Verified complete:** Auth workflows, Cart CRUD, Profile edits, Protected Routes.
**Fix first:** Stock decrementing, CORS environment variables.
**Complete payments next:** Razorpay setup, Order Controller update, Frontend Modal, Webhooks.
**Production launch requirements:** Cloudinary integration (if not static), production proxy config.
**Optional later:** Product list pagination, Reviews/Ratings.

### I. Final recommendation
**Can we start payment integration now?** 
No, exactly one thing must be fixed first. 

Before writing the Razorpay integration code, we must fix the **Stock Management** (decrementing inventory safely during order creation). Currently, users can purchase infinite items because inventory checks do not exist. Once `orderController.js` securely handles stock, we can immediately begin the Razorpay backend integration.
