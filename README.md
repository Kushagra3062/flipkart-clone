<p align="center">
  <img src="https://img.shields.io/badge/Flipkart-Clone-2874F0?style=for-the-badge&logo=flipkart&logoColor=white" alt="Flipkart Clone" />
</p>

<h1 align="center">🛒 Flipkart Clone — Full-Stack E-Commerce Platform</h1>

<p align="center">
  <em>A production-grade, pixel-perfect replica of India's largest e-commerce platform, built from the ground up with a modern async Python backend and a blazing-fast React frontend.</em>
</p>

<p align="center">
  <a href="https://flipkart-clone-ebon-five.vercel.app"><img src="https://img.shields.io/badge/🌐_Live_Demo-Vercel-000?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="https://flipkart-clone-0252.onrender.com"><img src="https://img.shields.io/badge/⚡_API_Server-Render-46E3B7?style=for-the-badge&logo=render" alt="API Server" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7.4-DC382D?logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Supabase-Cloud_DB-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [System Architecture](#️-system-architecture)
- [Technology Stack](#-technology-stack)
- [Database Schema (ER Diagram)](#-database-schema--entity-relationship-diagram)
- [Features In-Depth](#-features-in-depth)
  - [Authentication & Security](#1--authentication--security)
  - [Product Catalog & Discovery](#2--product-catalog--discovery)
  - [Shopping Cart](#3--shopping-cart)
  - [Wishlist](#4--wishlist)
  - [Checkout & Orders](#5--checkout--orders)
  - [Address Management](#6--address-management)
  - [User Profile](#7--user-profile)
  - [Flipkart Plus Zone](#8--flipkart-plus-zone)
  - [Coupons & Discounts](#9--coupons--discounts)
  - [Gift Cards](#10--gift-cards)
  - [Ecosystem Pages](#11--ecosystem-pages)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Caching Strategy](#-caching-strategy)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

This project is a **comprehensive, full-stack clone** of **Flipkart**, India's leading e-commerce marketplace. It goes far beyond a simple storefront — it replicates the complete shopping ecosystem including product discovery, cart management, multi-step checkout, coupon redemption, gift card management, a loyalty rewards (Plus Zone), and intelligent OTP-based authentication via SMS (Twilio) and Email (SendGrid).

The application is designed using a **decoupled, three-tier cloud architecture** and is deployed live:

| Tier | Service | Technology |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://flipkart-clone-ebon-five.vercel.app) | Next.js 15 (App Router) |
| **Backend** | [Render](https://flipkart-clone-0252.onrender.com) | FastAPI + Uvicorn (ASGI) |
| **Database** | [Supabase](https://supabase.com) | Managed PostgreSQL 16 |
| **Cache** | [Render Key-Value](https://render.com) | Managed Redis 7 |

---

## 🔗 Live Demo

| | URL |
| :--- | :--- |
| 🌐 **Frontend** | [flipkart-clone-ebon-five.vercel.app](https://flipkart-clone-ebon-five.vercel.app) |
| ⚡ **Backend API** | [flipkart-clone-0252.onrender.com](https://flipkart-clone-0252.onrender.com) |

> **Note**: The Render free tier may cold-start in ~30 seconds on the first request. Subsequent requests are instant.

---

## 🏗️ System Architecture

The application follows a modern, decoupled microservices-inspired architecture with clear separation of concerns across three independently deployable tiers.

```mermaid
graph TB
    subgraph "Client Layer"
        A["🖥️ Browser<br/>(User)"]
    end

    subgraph "Frontend (Vercel CDN)"
        B["⚡ Next.js 15<br/>App Router<br/>Server Components"]
        C["🗂️ Zustand Stores<br/>Auth · Cart · Wishlist · Address"]
        D["📡 Axios HTTP Client<br/>API Interceptors + JWT"]
    end

    subgraph "Backend (Render)"
        E["🚀 FastAPI<br/>ASGI Application"]
        F["🔒 CORS Middleware<br/>Origin Validation"]
        G["🛡️ Auth Layer<br/>JWT + Google OAuth"]
        H["📦 Service Layer<br/>AuthService · CartService<br/>OrderService · ProductService"]
        I["💾 SQLAlchemy ORM<br/>Async Session + Models"]
        J["⚡ Redis Cache<br/>Response Caching + OTP Store"]
    end

    subgraph "Data Layer (Cloud)"
        K[("🐘 PostgreSQL<br/>Supabase<br/>12 Tables")]
        L[("🔴 Redis<br/>Render KV<br/>Cache + OTPs")]
    end

    subgraph "External Services"
        M["📱 Twilio Verify<br/>SMS OTP"]
        N["📧 SendGrid<br/>Email OTP"]
        O["🔐 Google OAuth 2.0<br/>Social Login"]
    end

    A --> B
    B --> C
    B --> D
    D -->|"HTTPS + JWT"| F
    F --> E
    E --> G
    E --> H
    H --> I
    H --> J
    I -->|"asyncpg"| K
    J -->|"redis-py"| L
    G --> M
    G --> N
    G --> O

    style A fill:#FFE082,stroke:#F57F17,color:#000
    style B fill:#000,stroke:#fff,color:#fff
    style E fill:#009688,stroke:#004D40,color:#fff
    style K fill:#4169E1,stroke:#1A237E,color:#fff
    style L fill:#DC382D,stroke:#B71C1C,color:#fff
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant User as 🖥️ Browser
    participant Next as ⚡ Next.js (Vercel)
    participant API as 🚀 FastAPI (Render)
    participant Cache as 🔴 Redis
    participant DB as 🐘 PostgreSQL

    User->>Next: Navigate to /category/mobiles
    Next->>API: GET /api/v1/categories/mobiles/products
    API->>Cache: Check cache key
    alt Cache Hit
        Cache-->>API: Return cached JSON
    else Cache Miss
        API->>DB: SELECT products WHERE category=mobiles
        DB-->>API: Product rows
        API->>Cache: SET cache key (TTL: 300s)
    end
    API-->>Next: JSON Response
    Next-->>User: Rendered Product Grid
```

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15** | React framework with App Router, SSR, file-based routing |
| **TypeScript** | Type-safe development across all components |
| **Zustand** | Lightweight, hook-based global state management |
| **Axios** | HTTP client with request/response interceptors for JWT |
| **Lucide React** | Beautiful, consistent icon library |
| **CSS Modules** | Scoped, maintainable styling without class conflicts |

### Backend

| Technology | Purpose |
| :--- | :--- |
| **FastAPI** | High-performance async Python web framework |
| **SQLAlchemy 2.0** | Async ORM with relationship mapping and query building |
| **asyncpg** | High-speed async PostgreSQL driver |
| **Pydantic V2** | Data validation and serialization with `pydantic-settings` |
| **Alembic** | Database migration management |
| **Redis (async)** | Response caching and OTP session storage |
| **Passlib + bcrypt** | Secure password hashing |
| **python-jose** | JWT token creation and verification |
| **Twilio** | SMS OTP delivery and verification |
| **SendGrid** | Email OTP delivery |
| **Google Auth** | OAuth 2.0 social login token verification |

### Infrastructure

| Service | Role |
| :--- | :--- |
| **Vercel** | Frontend CDN, edge network, automatic CI/CD |
| **Render** | Backend hosting (Web Service), Redis (Key-Value Store) |
| **Supabase** | Managed PostgreSQL with connection pooling |
| **GitHub** | Version control, CI/CD trigger for auto-deployments |

---

## 📊 Database Schema — Entity Relationship Diagram

The application uses a normalized relational schema with **12 interconnected tables**, UUID primary keys, timestamp mixins, and carefully designed foreign key constraints with cascade rules.

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string name
        string phone UK
        string hashed_password
        string gender
        boolean is_verified
        boolean phone_verified
        string avatar_url
        boolean is_active
        integer supercoins
        boolean is_plus_member
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        string image_url
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        uuid id PK
        string name
        string slug UK
        text description
        decimal price
        decimal mrp
        decimal discount_percent
        integer stock_qty
        uuid category_id FK
        string brand
        decimal rating
        integer rating_count
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        string image_url
        boolean is_primary
        integer display_order
        timestamp created_at
        timestamp updated_at
    }

    CART_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        integer quantity
        timestamp created_at
        timestamp updated_at
    }

    WISHLIST {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        timestamp created_at
        timestamp updated_at
    }

    SHIPPING_ADDRESSES {
        uuid id PK
        uuid user_id FK
        string full_name
        string phone
        string address_type
        string address_line1
        string address_line2
        string city
        string state
        string pincode
        float latitude
        float longitude
        boolean is_default
        timestamp created_at
        timestamp updated_at
    }

    ORDERS {
        uuid id PK
        string order_number UK
        uuid user_id FK
        uuid address_id FK
        enum status
        decimal subtotal
        decimal discount
        decimal delivery_fee
        decimal total
        string payment_method
        string payment_status
        string coupon_code
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal unit_price
        decimal total_price
        timestamp created_at
        timestamp updated_at
    }

    COUPONS {
        uuid id PK
        string code UK
        string description
        float discount_value
        string discount_type
        float min_order_value
        datetime expiry_date
        boolean is_active
        uuid category_id
        timestamp created_at
        timestamp updated_at
    }

    GIFT_CARDS {
        uuid id PK
        string card_number UK
        string pin
        float balance
        datetime expiry_date
        boolean is_active
        uuid user_id FK
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ CART_ITEMS : "has"
    USERS ||--o{ WISHLIST : "saves"
    USERS ||--o{ SHIPPING_ADDRESSES : "manages"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ GIFT_CARDS : "owns"

    CATEGORIES ||--o{ PRODUCTS : "contains"

    PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
    PRODUCTS ||--o{ CART_ITEMS : "added_to"
    PRODUCTS ||--o{ WISHLIST : "saved_in"
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered_as"

    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS }o--|| SHIPPING_ADDRESSES : "shipped_to"
```

### Key Schema Design Decisions

| Decision | Rationale |
| :--- | :--- |
| **UUID Primary Keys** | Prevents sequential ID enumeration attacks and enables distributed ID generation |
| **Timestamp Mixin** | Every table automatically tracks `created_at` and `updated_at` via a shared `TimestampMixin` base class |
| **Soft Delete (`is_active`)** | Products are never physically deleted; a global ORM event filter transparently hides inactive products from all queries |
| **Composite Indexes** | `(category_id, is_active)` on Products for blazing fast category page queries |
| **Pattern Ops Index** | `varchar_pattern_ops` on `product.name` for optimized `LIKE` search operations |
| **Unique Constraints** | `(user_id, product_id)` on CartItems prevents duplicate cart entries at the database level |
| **Check Constraints** | `price >= 0` and `quantity > 0` enforce data integrity directly in PostgreSQL |
| **Cascade Deletes** | Deleting a User cascades to their CartItems, Wishlist, and Addresses; deleting a Product cascades to its Images |
| **Restrict Deletes** | Orders use `RESTRICT` on User and Address FKs — you cannot delete a user/address that has orders |

---

## ✨ Features In-Depth

### 1. 🔐 Authentication & Security

A multi-layered authentication system supporting three independent login methods with OTP verification.

| Method | Flow |
| :--- | :--- |
| **Email + Password** | Traditional signup → bcrypt hashing → JWT token issuance |
| **Google OAuth 2.0** | One-tap Google sign-in → ID token verification via `google-auth` → auto-registration + JWT |
| **OTP Verification** | Phone (Twilio Verify API) or Email (SendGrid) → 6-digit OTP → Redis-backed session with 5-minute TTL |

**Security Features:**
- **JWT Bearer Tokens** injected into every API request via Axios interceptors
- **Automatic Token Purge** — if a `401 Unauthorized` response is received, the token is cleared from `localStorage` and the user is logged out automatically
- **Password Reset** — OTP-verified password reset flow with bcrypt re-hashing
- **Redis OTP Fallback** — if Redis is unavailable, OTPs fall back to an in-memory store with TTL expiry

---

### 2. 🔍 Product Catalog & Discovery

A rich product browsing experience with **1,000+ products** across **10 categories**, powered by a high-performance async query engine.

| Feature | Description |
| :--- | :--- |
| **10 Categories** | Fashion · Mobiles · Electronics · Beauty · Home · Appliances · Toys · Food · Auto · Furniture |
| **Category Bar** | Horizontally scrollable icon bar with active category highlighting |
| **Product Cards** | Image, title, brand, star rating, rating count, price, MRP, discount percentage |
| **Multi-axis Sorting** | Relevance · Popularity · Price (Low→High) · Price (High→Low) · Newest First |
| **Price Filtering** | Min/Max price range selectors (₹500 – ₹100,000+) |
| **Rating Filtering** | 4★+ · 3★+ · 2★+ · 1★+ checkbox filters |
| **Search** | Real-time product search with PostgreSQL `varchar_pattern_ops` optimized index |
| **Pagination** | Server-side pagination with `limit` and `page` parameters returning total count and page metadata |
| **Soft Delete Filtering** | A global SQLAlchemy ORM event listener automatically excludes `is_active=False` products from all queries |

---

### 3. 🛒 Shopping Cart

A fully persistent, server-synchronized shopping cart with optimistic UI updates.

| Feature | Description |
| :--- | :--- |
| **Add to Cart** | One-click addition with quantity defaulting to 1 |
| **Quantity Control** | Increment/decrement buttons with real-time price recalculation |
| **Remove Item** | Swipe-to-delete or explicit remove button |
| **Price Breakdown** | Dynamic subtotal, discount savings, delivery fee, and final total computation |
| **Unique Constraint** | Database-level `UNIQUE(user_id, product_id)` prevents duplicate entries |
| **Zustand Store** | `cartStore.ts` provides global `items`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `fetchCart()`, and `clearCart()` |

---

### 4. ❤️ Wishlist

A dedicated wishlist system with real-time toggle synchronization.

| Feature | Description |
| :--- | :--- |
| **Heart Toggle** | Click the heart icon on any product card to add/remove from wishlist |
| **Dedicated Page** | `/wishlist` page displays all saved products in a grid layout |
| **Zustand Store** | `wishlistStore.ts` with `items`, `toggleWishlist()`, `fetchWishlist()`, and `isInWishlist()` |
| **Server Sync** | Every toggle makes a real-time API call to persist the state in PostgreSQL |

---

### 5. 📦 Checkout & Orders

A multi-step checkout flow with coupon support and order tracking.

```mermaid
flowchart LR
    A["🛒 Cart"] --> B["📍 Select Address"]
    B --> C["📋 Order Summary"]
    C --> D{"Apply Coupon?"}
    D -->|Yes| E["✅ Validate & Apply Discount"]
    D -->|No| F["💳 Place Order (COD)"]
    E --> F
    F --> G["🎉 Order Confirmed"]
    G --> H["📦 My Orders"]
```

| Feature | Description |
| :--- | :--- |
| **3-Step Flow** | Address Selection → Order Summary → Payment |
| **Coupon Integration** | Real-time coupon code validation with discount preview before placing order |
| **Order Number** | Auto-generated unique order number (e.g., `ORD-A3X7K9`) |
| **Order Status Tracking** | `PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED` / `CANCELLED` |
| **My Orders** | Comprehensive order history page with item details, prices, and status |
| **Order Detail** | Deep-link to individual order with full item list, address, and payment info |
| **Stock Deduction** | Product `stock_qty` is atomically decremented upon successful order placement |
| **Cart Clearing** | Cart is automatically emptied after successful checkout |

---

### 6. 📍 Address Management

A sophisticated address system with geolocation support and modal-based CRUD.

| Feature | Description |
| :--- | :--- |
| **Add/Edit/Delete** | Full CRUD operations via a polished modal dialog |
| **Address Types** | HOME · WORK · OTHER with visual labels |
| **Detect My Location** | Browser Geolocation API → Reverse Geocoding → auto-fills city, state, pincode |
| **Default Address** | Mark any address as default for quick checkout |
| **Geo-coordinates** | Latitude/longitude storage for future map visualization |
| **Zustand Store** | `addressStore.ts` with `addresses`, `fetchAddresses()`, `addAddress()`, `deleteAddress()`, and `setDefault()` |

---

### 7. 👤 User Profile

A comprehensive profile management dashboard.

| Feature | Description |
| :--- | :--- |
| **Personal Info** | Name, email, phone, gender editing |
| **Avatar Upload** | Profile picture management |
| **Phone Verification** | OTP-based phone number verification via Twilio |
| **Email Verification** | OTP-based email verification via SendGrid |
| **Password Change** | OTP-verified password reset flow |
| **Order History** | Quick access to all past orders |
| **Address Book** | Manage all saved shipping addresses |

---

### 8. ⭐ Flipkart Plus Zone

An exclusive membership dashboard showcasing loyalty rewards.

| Feature | Description |
| :--- | :--- |
| **SuperCoins Balance** | Displays the user's accumulated SuperCoin balance |
| **Plus Membership** | `is_plus_member` flag on the User model controls access |
| **Benefits Dashboard** | Visual grid of Plus membership benefits and perks |
| **Dedicated Page** | `/plus` route with premium UI styling |

---

### 9. 🎟️ Coupons & Discounts

An intelligent coupon engine with auto-refill, one-time-use enforcement, and real-time validation.

| Feature | Description |
| :--- | :--- |
| **Coupon Listing** | `/coupons` page displays all active, unused coupons for the logged-in user |
| **One-Time Use** | Coupons used in past orders are automatically hidden from the available list |
| **Auto-Refill** | When available coupons drop below 5, the system auto-generates new ones with random codes and discounts |
| **Discount Types** | Supports both `fixed` (₹ off) and `percentage` (% off) discount models |
| **Min Order Value** | Each coupon can have a minimum cart value requirement |
| **Checkout Integration** | Apply coupon code during checkout with real-time discount preview |
| **Validation API** | `POST /api/v1/coupons/validate` verifies code validity, checks one-time use, and calculates discount |

---

### 10. 🎁 Gift Cards

A gift card system for purchasing and managing prepaid store credits.

| Feature | Description |
| :--- | :--- |
| **Gift Card Listing** | `/gift-cards` page with premium banner and curated card grid |
| **Card Details** | Card number, PIN, balance, active status, expiry date |
| **Balance Check** | API endpoint to verify remaining balance on a gift card |
| **User Binding** | Gift cards can be optionally bound to a specific user via `user_id` FK |
| **AI-Generated Banners** | Custom hero banners generated with AI for a professional look |

---

### 11. 🌐 Ecosystem Pages

Additional pages that complete the Flipkart experience.

| Page | Route | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Hero carousel with AI-generated banners, "For You" product recommendations |
| **Login** | `/login` | Email/password + Google OAuth login |
| **Signup** | `/signup` | Registration with OTP verification |
| **Travel** | `/travel` | Flipkart Travel booking page (UI stub) |
| **Minutes** | `/minutes` | Flipkart Minutes grocery delivery (UI stub) |
| **Seller** | `/seller` | Become a Seller registration page (UI stub) |
| **Advertise** | `/advertise` | Flipkart advertising platform page (UI stub) |
| **Help Center** | `/helpcenter` | Customer support and FAQ page (UI stub) |
| **Download App** | `/download-app` | Mobile app download page (UI stub) |
| **Notifications** | `/notifications` | User notification center |
| **Notification Settings** | `/notification-settings` | Notification preferences |

---

## 🎨 Frontend Architecture

```mermaid
graph TB
    subgraph "Next.js App Router"
        A["layout.tsx<br/>Root Layout + Providers"]
        B["page.tsx<br/>Home Page"]
        C["category/[slug]/page.tsx<br/>Category Products"]
        D["product/[id]/page.tsx<br/>Product Detail"]
        E["cart/page.tsx<br/>Shopping Cart"]
        F["checkout/page.tsx<br/>Multi-Step Checkout"]
        G["profile/page.tsx<br/>User Dashboard"]
        H["wishlist/page.tsx<br/>Saved Items"]
        I["plus/page.tsx<br/>Plus Zone"]
        J["coupons/page.tsx<br/>Coupon Catalog"]
        K["gift-cards/page.tsx<br/>Gift Cards"]
    end

    subgraph "Shared Components"
        L["Navbar.tsx<br/>Search + Auth + Navigation"]
        M["CategoryBar.tsx<br/>Category Icon Strip"]
        N["ProductCard.tsx<br/>Reusable Product Tile"]
        O["HeroCarousel.tsx<br/>Swipeable Banner Slider"]
        P["AddressModal.tsx<br/>Address CRUD Modal"]
        Q["Skeleton.tsx<br/>Shimmer Loading States"]
    end

    subgraph "State Management (Zustand)"
        R["authStore<br/>Token + User + Login/Logout"]
        S["cartStore<br/>Items + Add/Remove/Update"]
        T["wishlistStore<br/>Items + Toggle/Fetch"]
        U["addressStore<br/>Addresses + CRUD + Default"]
    end

    subgraph "API Layer"
        V["api.ts<br/>Axios Instance + Interceptors"]
    end

    A --> B & C & D & E & F & G & H & I & J & K
    B & C & D & E & F & G & H --> L & M & N
    B --> O
    F --> P
    B & C & D --> Q
    V --> R & S & T & U
```

---

## ⚙️ Backend Architecture

The backend follows a clean **Layered Architecture** pattern:

```
Routes (Controllers)  →  Services (Business Logic)  →  Models (Data Access)
        ↕                        ↕                          ↕
   Pydantic Schemas      Redis Cache Layer           SQLAlchemy ORM
```

```mermaid
graph LR
    subgraph "API Routes"
        A1["auth.py"]
        A2["products.py"]
        A3["cart.py"]
        A4["orders.py"]
        A5["coupons.py"]
        A6["gift_cards.py"]
        A7["plus.py"]
        A8["user_profile.py"]
    end

    subgraph "Services"
        S1["AuthService<br/>signup · login · OTP · OAuth"]
        S2["ProductService<br/>list · search · filter · detail"]
        S3["CartService<br/>add · remove · update · clear"]
        S4["OrderService<br/>place · list · detail · cancel"]
    end

    subgraph "Models (12 Tables)"
        M1["User"]
        M2["Product + ProductImage"]
        M3["Category"]
        M4["CartItem"]
        M5["Order + OrderItem"]
        M6["ShippingAddress"]
        M7["Wishlist"]
        M8["Coupon"]
        M9["GiftCard"]
    end

    A1 --> S1
    A2 --> S2
    A3 --> S3
    A4 --> S4
    S1 --> M1
    S2 --> M2 & M3
    S3 --> M4 & M2
    S4 --> M5 & M6 & M4 & M8
```

---

## 🚀 Caching Strategy

The application uses a **Redis-backed caching layer** with custom decorators for automatic cache invalidation.

| Layer | Strategy | TTL |
| :--- | :--- | :--- |
| **Product Listings** | Cache by category slug + query params | 300s |
| **Product Detail** | Cache by product UUID | 300s |
| **OTP Sessions** | Store in Redis with automatic expiry | 300s |
| **Cart/Orders** | No caching (always real-time) | — |

**Fallback**: If Redis is unavailable, the application gracefully degrades — OTPs fall back to an in-memory Python dict, and cache misses simply hit PostgreSQL directly.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Register new user |
| `POST` | `/api/v1/auth/login` | Login (email + password) |
| `POST` | `/api/v1/auth/google` | Google OAuth login |
| `POST` | `/api/v1/auth/send-otp` | Send OTP via email/SMS |
| `POST` | `/api/v1/auth/verify-otp` | Verify OTP code |
| `POST` | `/api/v1/auth/reset-password` | OTP-verified password reset |

### Products
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products` | List all products (paginated) |
| `GET` | `/api/v1/products/{id}` | Get product detail |
| `GET` | `/api/v1/products/search?q=` | Search products by name |
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/categories/{slug}/products` | Products by category with filters |

### Cart
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/cart` | Get current user's cart |
| `POST` | `/api/v1/cart/add` | Add item to cart |
| `PUT` | `/api/v1/cart/{id}` | Update item quantity |
| `DELETE` | `/api/v1/cart/{id}` | Remove item from cart |

### Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/orders/checkout` | Place order from cart |
| `GET` | `/api/v1/orders` | List user's orders |
| `GET` | `/api/v1/orders/{id}` | Get order details |

### Addresses
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/addresses` | List user's addresses |
| `POST` | `/api/v1/addresses` | Add new address |
| `PUT` | `/api/v1/addresses/{id}` | Update address |
| `DELETE` | `/api/v1/addresses/{id}` | Delete address |

### Coupons & Gift Cards
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/coupons` | List available coupons |
| `POST` | `/api/v1/coupons/validate` | Validate coupon code |
| `GET` | `/api/v1/giftcards` | List gift cards |
| `POST` | `/api/v1/giftcards/check-balance` | Check gift card balance |

### Profile & Plus
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/profile` | Get user profile |
| `PUT` | `/api/v1/profile` | Update profile |
| `GET` | `/api/v1/plus/status` | Get Plus membership status |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.12
- **PostgreSQL** ≥ 15
- **Redis** (optional, degrades gracefully)

### 1. Clone the Repository

```bash
git clone https://github.com/Kushagra3062/flipkart-clone.git
cd flipkart-clone
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL, secrets, and API keys

# Run database migrations
alembic upgrade head

# Seed the database (1,000 products + coupons + gift cards)
python -m scripts.seed

# Start the development server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the development server
npm run dev
```

### 4. Environment Variables

#### Backend (`.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection (asyncpg) | `postgresql+asyncpg://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `SECRET_KEY` | JWT signing secret | `your-secret-key-here` |
| `CLOUDINARY_URL` | Cloudinary connection | `cloudinary://key:secret@cloud` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `DEFAULT_USER_ID` | Default test user UUID | `00000000-0000-0000-0000-000000000000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxxx.apps.googleusercontent.com` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_VERIFY_SERVICE_SID` | Twilio Verify service SID | `VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxxxxxxxxxxxxxxxxxxxxxxxx` |
| `SENDGRID_FROM_EMAIL` | SendGrid sender email | `noreply@yourdomain.com` |

#### Frontend (`.env.local`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxxx.apps.googleusercontent.com` |

---

## ☁️ Deployment

### Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────▶│    Render    │────▶│  Supabase    │
│  (Frontend)  │     │  (Backend)   │     │ (PostgreSQL) │
│  Next.js 15  │     │   FastAPI    │     │              │
└─────────────┘     │   + Redis    │     └──────────────┘
                     └──────────────┘
```

### Render (Backend)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add all environment variables from the table above
- Use **Key Value** store for Redis

### Vercel (Frontend)
- **Framework**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- Add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to environment variables

### Post-Deployment
1. Copy final Vercel URL → Add to Render's `ALLOWED_ORIGINS`
2. Add Vercel URL to Google Cloud Console OAuth authorized origins
3. Run `python -m scripts.seed` against Supabase to populate data

---

## 📂 Project Structure

```
flipkart-clone/
├── 📁 backend/
│   ├── 📁 alembic/                 # Database migration scripts
│   │   ├── versions/               # Individual migration files
│   │   └── env.py                  # Alembic configuration
│   ├── 📁 app/
│   │   ├── 📁 api/routes/          # FastAPI route handlers
│   │   │   ├── auth.py             # Authentication endpoints
│   │   │   ├── products.py         # Product CRUD & search
│   │   │   ├── cart.py             # Cart management
│   │   │   ├── orders.py           # Checkout & order history
│   │   │   ├── coupons.py          # Coupon engine
│   │   │   ├── gift_cards.py       # Gift card management
│   │   │   ├── plus.py             # Plus Zone APIs
│   │   │   └── user_profile.py     # Profile & verification
│   │   ├── 📁 cache/               # Redis caching layer
│   │   │   ├── decorators.py       # @cache_response decorator
│   │   │   └── keys.py             # Cache key generators
│   │   ├── 📁 core/                # App configuration
│   │   │   ├── config.py           # Pydantic Settings
│   │   │   └── dependencies.py     # DI: get_db, get_cache, get_current_user
│   │   ├── 📁 db/
│   │   │   └── session.py          # Async engine + soft-delete filter
│   │   ├── 📁 models/              # SQLAlchemy ORM models (12 tables)
│   │   ├── 📁 schemas/             # Pydantic request/response schemas
│   │   ├── 📁 services/            # Business logic layer
│   │   └── main.py                 # FastAPI app entry point
│   ├── 📁 scripts/
│   │   ├── seed.py                 # Database seeder (1,000 products)
│   │   └── fix_db.py               # Image URL migration script
│   ├── requirements.txt            # Python dependencies (locked)
│   └── .env                        # Environment variables
├── 📁 frontend/
│   ├── 📁 app/                     # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout + Providers
│   │   ├── page.tsx                # Home page
│   │   ├── 📁 category/[slug]/     # Dynamic category pages
│   │   ├── 📁 product/[id]/        # Dynamic product detail
│   │   ├── 📁 cart/                # Shopping cart
│   │   ├── 📁 checkout/            # Multi-step checkout
│   │   ├── 📁 wishlist/            # Saved items
│   │   ├── 📁 profile/             # User dashboard
│   │   ├── 📁 login/ & signup/     # Authentication
│   │   ├── 📁 plus/                # Plus Zone
│   │   ├── 📁 coupons/             # Coupon catalog
│   │   ├── 📁 gift-cards/          # Gift cards
│   │   └── 📁 ...                  # Ecosystem pages
│   ├── 📁 components/              # Reusable React components
│   ├── 📁 store/                   # Zustand state stores
│   ├── 📁 lib/
│   │   └── api.ts                  # Axios client + interceptors
│   ├── next.config.ts              # Next.js configuration
│   ├── package.json                # Node.js dependencies
│   └── .env.local                  # Frontend environment variables
└── README.md                       # You are here! 📖
```

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Kushagra3062">Kushagra Singh</a>
</p>
