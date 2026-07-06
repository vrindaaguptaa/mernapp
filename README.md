# 🍔 GoFood - Full Stack Food Delivery Platform

A modern **MERN Stack Food Delivery Application** featuring secure authentication, online ordering, admin dashboard, order management, and Razorpay payment integration.

# 🌐 Live Deployment

### Frontend (Vercel)

https://mernapp-fq3h-livid.vercel.app

### Backend API (Render)

https://mernapp-b9of.onrender.com

### GitHub Repository

https://github.com/vrindaaguptaa/mernapp

---

# 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

# 📸 Preview

> Add screenshots here after uploading them to GitHub.

- Home Page
- Food Menu
- Cart
- Checkout
- Orders
- Admin Dashboard
- Food Management
- Category Management

---

# ✨ Features

## 👤 User Features

- Secure User Registration & Login
- JWT Authentication
- Browse Food Menu
- Search & Filter Food Items
- Category Filtering
- Add to Cart
- Quantity Management
- Razorpay Online Payment
- Order Placement
- Order History
- Live Order Status Tracking
- Responsive Design

---

## 👨‍💼 Admin Features

- Admin Authentication
- Dashboard Analytics
- Manage Food Items
- Add / Edit / Delete Categories
- Add / Edit / Delete Food Items
- Manage Customer Orders
- Update Order Status
  - Placed
  - Preparing
  - Delivered
- Revenue Statistics
- Customer Statistics

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Bootstrap 5
- Material UI Icons
- React Toastify

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

## Database

- MongoDB Atlas

## Payment Gateway

- Razorpay

## Deployment

- Frontend → Vercel
- Backend → Render

---

# 📂 Folder Structure

```
mernapp
│
├── backend
│   ├── middleware
│   ├── Routes
│   ├── db.js
│   ├── index.js
│   └── package.json
│
├── public
│
├── src
│   ├── components
│   ├── screens
│   ├── utils
│   ├── App.js
│   └── ContextReducer.js
│
├── package.json
└── README.md
```

---

# ⚙️ System Architecture

```
                React Frontend
                       │
             REST API (Fetch)
                       │
                Express Backend
                       │
        ┌──────────────┴──────────────┐
        │                             │
     MongoDB Atlas              Razorpay API
        │
        ▼
     Store Users,
 Food Items & Orders
```

---

# 🔐 Authentication Flow

```
User Login
      │
      ▼
Express API
      │
Verify Credentials
      │
      ▼
Generate JWT Token
      │
      ▼
Store Token in LocalStorage
      │
      ▼
Protected Routes Access
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/vrindaaguptaa/mernapp.git
```

---

## Install Frontend

```bash
npm install
```

---

## Install Backend

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

FRONTEND_URL=http://localhost:3000

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret
```

---

# ▶️ Run the Project

## Start Backend

```bash
cd backend
npx nodemon index.js
```

---

## Start Frontend

```bash
npm start
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/createuser |
| POST | /api/loginuser |

---

## Food

| Method | Endpoint |
|---------|----------|
| GET | /api/foodData |

---

## Orders

| Method | Endpoint |
|---------|----------|
| POST | /api/orderData |
| POST | /api/myOrderData |

---

## Admin

| Method | Endpoint |
|---------|----------|
| GET | /api/admin/dashboard |
| GET | /api/admin/foods |
| POST | /api/admin/addFood |
| PUT | /api/admin/editFood/:id |
| DELETE | /api/admin/deleteFood/:id |
| GET | /api/admin/categories |
| POST | /api/admin/addCategory |
| PUT | /api/admin/editCategory/:id |
| DELETE | /api/admin/deleteCategory/:id |
| GET | /api/admin/orders |
| PUT | /api/admin/updateOrderStatus/:id |

---

# 🚀 Future Improvements

- Email Notifications
- Coupon System
- Wishlist
- Product Reviews
- Image Upload using Cloudinary
- Restaurant Panel
- Delivery Partner Module
- Push Notifications

---

# 💻 Key Concepts Used

- MERN Stack
- REST APIs
- JWT Authentication
- Protected Routes
- Context API
- React Hooks
- CRUD Operations
- MongoDB Aggregation
- Payment Gateway Integration
- Responsive UI Design

---

# 👨‍💻 Author

**Vrinda Gupta**

B.Tech CSE | NIT Patna

GitHub:
https://github.com/vrindaaguptaa

LinkedIn:
(Add your LinkedIn profile here)

---

# ⭐ If you found this project useful, don't forget to star the repository!
