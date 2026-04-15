# 🚀 Flipkart Clone: Premium Full-Stack E-commerce Experience

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-05998b?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A high-performance, aesthetically pleasing Flipkart clone designed to provide a seamless shopping journey. Built with a modern polyglot stack featuring **Next.js 15** for a lightning-fast frontend and **FastAPI** for a robust, asynchronous backend.

---

## ✨ Key Features

- **💎 Premium UI/UX**: Crafted with Vanilla CSS and Tailwind for a pixel-perfect, responsive design inspired by Flipkart's modern aesthetics.
- **✨ Shimmer Skeleton Loading**: Sophisticated shimmer placeholders on all pages (Home, Product Detail, Category, Cart) for zero layout shift and a premium feel.
- **🔐 Secure Authentication**: Integrated Google OAuth and JWT-based session management.
- **📦 Advanced Search & Filtering**: Dynamic product discovery with price, rating, and category-based filtering.
- **🛒 Real-time Cart & Wishlist**: Global state synchronization using Zustand with persistence.
- **📍 Smart Address Management**: Integrated "Detect My Location" feature using browser Geolocation API and Reverse Geocoding.
- **🚚 Live Order Tracking**: Instant order success deep-linking and a comprehensive "My Orders" history section.

---

## 🛠️ Technology Stack

| Frontend | Backend | Database & Auth |
| :--- | :--- | :--- |
| **Next.js 15 (App Router)** | **FastAPI (Python 3.12)** | **PostgreSQL (SQLAlchemy)** |
| **Zustand** (State Management) | **Pydantic V2** (Validation) | **Google OAuth 2.0** |
| **Framer Motion** (Animations) | **Uvicorn** (ASGI Server) | **JWT** (Security) |
| **Lucide Icons** | **PostgreSQL** | **Railway/Render** (Target) |

---

## 📸 Visual Verification

````carousel
![Premium Home Banners](https://github.com/your-username/flipkart-clone/assets/home_banners.png)
*Shimmering Home Page with Premium AI-Generated Banners*
<!-- slide -->
![Product Page Skeleton](https://github.com/your-username/flipkart-clone/assets/product_skeleton.png)
*Layout-stable Skeleton Loading for Product Details*
````

> [!NOTE]
> All e-commerce banners were custom-generated using AI for a professional, high-conversion look.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables
Ensure you have `.env` files in both directories with the following keys:
- `DATABASE_URL` (Backend)
- `JWT_SECRET` (Backend)
- `NEXT_PUBLIC_API_URL` (Frontend)

---

## 🗺️ Deployment Roadmap
For a "Perfect" deployment, refer to our comprehensive [Deployment Guide](./brain/deployment_guide.md).
- **Frontend**: Vercel (Native support for Next.js 15).
- **Backend**: Render or Railway (Docker/Gunicorn).
- **Database**: Neon or Supabase (Managed PostgreSQL).

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Your Name/Antigravity]**
