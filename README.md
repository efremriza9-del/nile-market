# 🌊 Nile Market — Full Stack E-Commerce

Ethiopia's premier online marketplace built with React + Node.js + MongoDB.

## 📁 Project Structure

```
nile-market/
├── client/          # React Frontend
└── server/          # Node.js Backend
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env: add your MONGO_URI from MongoDB Atlas
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# .env already points to localhost:5000
npm start
```

---

## 🔑 Environment Variables

### Server (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster0.mongodb.net/nilemarket
JWT_SECRET=your_secret_key
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 📦 Features

- ✅ Home Page with Hero, Categories, Featured Products
- ✅ Shop Page with Search & Category Filter + Pagination
- ✅ Product Detail Page with Images, Reviews
- ✅ **Post Product Page** with Multi-Image Upload (up to 5 photos)
- ✅ Shopping Cart (persists in localStorage)
- ✅ Checkout with Order Placement
- ✅ Login & Register (JWT Auth)
- ✅ Admin Dashboard (Stats, Orders, Users)

---

## 🌍 Deployment

### Backend (Render / Railway)
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables
4. Start command: `npm start`

### Frontend (Netlify)
1. Build command: `npm run build`
2. Publish directory: `build`
3. Add `REACT_APP_API_URL=https://api.nilemarket.com`
4. `public/_redirects` file already included for routing

---

## 👑 Create Admin User

Register normally, then in MongoDB Atlas:
```
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React 18 | Node.js |
| React Router v6 | Express |
| Axios | Mongoose |
| React Hot Toast | JWT Auth |
| React Icons | Multer (images) |
| CSS Modules | MongoDB Atlas |
