# Mahati Textile Center — Full-Stack MERN E-Commerce Walkthrough

We have completed the production-ready, mobile-first e-commerce web application for **"Mahati Textile Center"**, strictly enforcing the **100% Zero Ongoing Cost ($0 / ₹0)** architectural constraint.

---

## 1. Architectural Architecture ($0 / ₹0 Ongoing Cost)

| Layer | Provider / Standard | Cost Model |
| :--- | :--- | :--- |
| **Frontend SPA** | React 18 + Vite + Tailwind CSS | Vercel / Netlify Free Tier ($0/mo) |
| **Backend API** | Node.js + Express.js REST API | Render / Railway Free Tier ($0/mo) |
| **Database** | MongoDB Atlas M0 Cluster | Permanent Free Tier (512MB) |
| **Payments** | NPCI UPI Direct (`upi://pay`) | **0% MDR / ₹0 Gateway Commission** |
| **Communication**| Native WhatsApp Deep Link (`wa.me`) | Zero-Cost Fallback & Inquiries |

---

## 2. Implemented Features & Nuances

### 2.1 Store Profile & Multi-Department Catalog
- **Women's Wear**: Handwoven Kanchipuram bridal silk sarees, Chanderi Kurtis, and dress materials.
- **Men's Apparel**: Pure French linen shirts, South Indian combed cotton 9x5 double dhotis (Veshti) with golden zari borders.
- **Innerwear**: Precise band & cup size attributes (32B, 34B, 36C) and combed cotton gym vests with chest dimensions.
- **Bangles & Accessories**: Traditional glass and metal bangles with standardized Indian wrist diameter sizes (**2.4, 2.6, 2.8**).
- **Daily Wear & Home Fabrics**: Pure honeycomb quick-dry bath towels and handloom woven jacquard double/single bedspreads.

### 2.2 Client-Side Innovations (`client/`)
1. **Dynamic Variant Picker**:
   - Updates price, regular/discount rate, SKU, and live stock indicator in real time based on selected size, color, or fabric.
2. **Persistent Cart Drawer (`CartContext.jsx`)**:
   - Automatically synchronizes with `localStorage`.
   - Free delivery progress threshold (Free above ₹999).
3. **Zero-Fee Dynamic UPI QR Checkout (`UpiCheckout.jsx`)**:
   - Generates standardized NPCI URI:
     ```
     upi://pay?pa=mahatitextiles@upi&pn=Mahati+Textile+Center&am={TOTAL}&tn=MTC_Order_{ORDER_ID}&cu=INR
     ```
   - Renders dynamic high-res QR code via `qrcode.react`.
   - Mobile deep linking button ("Pay via any UPI App").
   - Strict 12-digit numeric regex validation for bank UTR transaction reference (`/^\d{12}$/`).
4. **Zero-Cost WhatsApp Fallback (`WhatsAppFallback.jsx`)**:
   - Pre-formats an itemized order invoice with customer delivery address into a `https://wa.me/...` deep link.

### 2.3 Merchant Admin & Walk-In POS (`AdminDashboard.jsx`)
1. **Order Verification Queue (`OrderQueue.jsx`)**:
   - Live queue filterable by `PENDING_VERIFICATION`, `VERIFIED`, and fulfillment stages.
   - One-click **"Approve & Mark Paid"** matching the customer's 12-digit UTR, which automatically decrements variant stock from MongoDB.
2. **Walk-In Counter POS (`WalkInPOS.jsx`)**:
   - Fast counter sale interface for in-store physical walk-in customers.
   - Quick catalog search, variant picker, and instant stock synchronization.

---

## 3. Visual Verification & Proof

### Storefront & Catalog Verification
![Home Page Verification](file:///C:/Users/sandeep%20kumar/.gemini/antigravity-ide/brain/5d211ffe-8656-4a21-8e04-7c4a5610b60d/home_page_verification_1789485334511.png)

### Merchant Order Verification Queue
![Verified Order in Admin](file:///C:/Users/sandeep%20kumar/.gemini/antigravity-ide/brain/5d211ffe-8656-4a21-8e04-7c4a5610b60d/order_verified_admin_1789485819555.png)

### End-to-End Workflow Recording
The entire end-to-end customer purchasing flow (catalog browsing, variant selection, cart checkout, UPI QR, UTR submission) and merchant order verification was recorded:
![Complete Demo Recording](file:///C:/Users/sandeep%20kumar/.gemini/antigravity-ide/brain/5d211ffe-8656-4a21-8e04-7c4a5610b60d/mahati_store_demo_1789485298573.webp)

---

## 4. Key Project Files Summary

```
Mahati Textile Center/
├── server/
│   ├── config/db.js               # MongoDB connection
│   ├── models/
│   │   ├── Product.js            # Category, dynamic variants, effectivePrice virtual
│   │   ├── Order.js              # Order items, 12-digit UTR regex, verifyPayment()
│   │   └── User.js               # Admin authentication model with bcrypt
│   ├── controllers/
│   │   ├── authController.js     # Admin login and profile
│   │   ├── productController.js  # Faceted search, CRUD, variant stock management
│   │   └── orderController.js    # Order creation, UTR verification, Walk-In POS sale
│   ├── routes/
│   │   ├── auth.js, products.js, orders.js
│   │   └── ...
│   ├── utils/
│   │   ├── upi.js                # NPCI UPI URI generation & UTR validation
│   │   └── whatsapp.js           # WhatsApp message invoice formatter
│   ├── seed.js                   # Catalog & default admin seeder
│   └── server.js                 # Express server entry point (Port 5000)
│
└── client/
    ├── src/
    │   ├── context/
    │   │   ├── CartContext.jsx   # LocalStorage persistent shopping bag
    │   │   ├── AuthContext.jsx   # Admin authentication session
    │   │   └── FilterContext.jsx # Catalog faceted filters
    │   ├── components/
    │   │   ├── common/Header.jsx, Footer.jsx, LoadingSpinner.jsx
    │   │   ├── products/ProductCard.jsx, ProductGrid.jsx, ProductFilters.jsx, VariantPicker.jsx
    │   │   ├── cart/CartDrawer.jsx
    │   │   ├── checkout/UpiCheckout.jsx, WhatsAppFallback.jsx, OrderForm.jsx
    │   │   └── admin/OrderQueue.jsx, WalkInPOS.jsx
    │   ├── pages/
    │   │   ├── Home.jsx, Shop.jsx, ProductDetail.jsx
    │   │   ├── Checkout.jsx, OrderSuccess.jsx
    │   │   └── AdminLogin.jsx, AdminDashboard.jsx
    │   ├── services/api.js       # Axios service
    │   └── utils/formatters.js, validators.js
    └── vite.config.js            # Tailwind CSS v4 + React Vite configuration
```

---

## 5. How to Run Locally

### Backend Server (Port 5000)
```bash
cd server
npm run dev
# Or to re-seed demo data:
npm run seed
```

### Frontend Client (Port 5173)
```bash
cd client
npm run dev
```

### Admin Credentials
- **URL**: Click the Lock icon in the header or visit `/admin`
- **Username**: `admin`
- **Password**: `AdminPassword123!`
