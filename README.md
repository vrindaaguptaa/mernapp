# 🍔 GoFood – Full Stack MERN Food Delivery Platform

GoFood is a full-stack food ordering platform built using the MERN stack. It allows users to browse food items, search by category, place orders, and track their order status. The application also includes a secure admin dashboard for managing food items, categories, and customer orders.

---

# 🌐 Live Demo

### Frontend (Vercel)

https://mernapp-fq3h-livid.vercel.app

### Backend API (Render)

https://mernapp-b9of.onrender.com

### GitHub Repository

https://github.com/vrindaaguptaa/mernapp

---

# ✨ Features

## 👤 Customer Features

- User Registration & Login
- JWT Authentication
- Browse Food Menu
- Search Food Items
- Filter by Category
- Add Items to Cart
- Quantity Selection
- Place Orders
- View Order History
- Track Live Order Status
- Responsive User Interface

---

## 👨‍💼 Admin Features

- Secure Admin Login
- Dashboard Overview
- Add Food Items
- Edit Food Items
- Delete Food Items
- Manage Categories
- Update Order Status
- View Customer Orders
- Dashboard Statistics

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

## Deployment

- Frontend → Vercel
- Backend → Render

---

# 📂 Project Structure

```
mernapp/
│
├── backend/
│   ├── middleware/
│   ├── Routes/
│   ├── db.js
│   ├── index.js
│   └── package.json
│
├── public/
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── utils/
│   ├── App.js
│   └── ContextReducer.js
│
├── package.json
└── README.md
```

---

# 🏗️ System Architecture

```
                 React Frontend
                        │
                        ▼
                 REST API Requests
                        │
                        ▼
               Express.js Backend
                        │
                JWT Authentication
                        │
                        ▼
                 MongoDB Atlas
```

---

# 🔐 Authentication Flow

```
User Login
     │
     ▼
Backend Authentication
     │
     ▼
Verify Credentials
     │
     ▼
Generate JWT Token
     │
     ▼
Store Token
(Local Storage)
     │
     ▼
Access Protected Routes
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/vrindaaguptaa/mernapp.git
```

---

## Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:3000
```

---

# ▶️ Running the Project

## Start Backend

```bash
cd backend
npx nodemon index.js
```

## Start Frontend

```bash
npm start
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|----------|--------------------|
| POST | /api/createuser |
| POST | /api/loginuser |

---

## Food

| Method | Endpoint |
|----------|----------------|
| GET | /api/foodData |

---

## Orders

| Method | Endpoint |
|----------|----------------|
| POST | /api/orderData |
| POST | /api/myOrderData |

---

## Admin

| Method | Endpoint |
|----------|-------------------------------|
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

# 💡 Key Concepts Implemented

- MERN Stack Development
- RESTful APIs
- JWT Authentication
- Protected Routes
- CRUD Operations
- React Context API
- React Hooks
- MongoDB Atlas
- Responsive UI
- Admin Dashboard
- Order Management

---

# 🚀 Future Enhancements

- Online Payment Gateway Integration
- Image Upload Support
- Email Notifications
- Coupon System
- Customer Reviews & Ratings
- Restaurant Panel

---

# 👩‍💻 Author

**Vrinda Gupta**

B.Tech CSE, NIT Patna

GitHub:
https://github.com/vrindaaguptaa

---

⭐ If you like this project, consider giving it a star!
