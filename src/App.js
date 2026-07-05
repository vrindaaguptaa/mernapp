import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './screens/Home';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Cart from './screens/Cart';
import Orders from './screens/Orders';
import OrderDetails from './screens/OrderDetails';
import AdminDashboard from './screens/AdminDashboard';
import AdminFood from './screens/AdminFood';
import AdminCategories from './screens/AdminCategories';
import AdminOrders from './screens/AdminOrders';
import Navbar from './components/Navbar';
import { CartProvider } from './components/ContextReducer';
import { ToastContainer } from 'react-toastify';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';

function AppRoutes() {
  const location = useLocation();

  return (
    <div className="app-content page-enter" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createuser" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/foods" element={<AdminFood />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={1800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <AppRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;
