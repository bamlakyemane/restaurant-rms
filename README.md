# 🍽️ Restaurant RMS

A modern Restaurant Management System built with React 19, Vite, and Tailwind CSS v4.

## ✨ Features

- 🔐 **Role-based auth** — Admin / Waiter / Chef with protected routes
- 📊 **Dashboard** — KPIs, revenue charts, top sellers, live activity
- 🍕 **Menu management** — Full CRUD with search, filters, availability toggle
- 🧾 **Order management** — Create, track, and manage orders
- 👨‍🍳 **Kitchen Display** — Real-time ticket board with item-level tracking
- 📅 **Reservations** — Bookings with status workflow (confirmed / seated / cancelled)
- 👥 **Staff management** — Add, edit, remove team members (admin only)
- 🌗 **Dark mode** — Persisted theme preference
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v6
- Context API (auth + theme)
- localStorage (fake backend via `services/api.js`)
- Recharts (analytics)
- lucide-react (icons)
- react-hot-toast (notifications)

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/restaurant-rms.git
cd restaurant-rms
npm install
npm run dev