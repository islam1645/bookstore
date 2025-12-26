import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import des composants
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton'; 
import AdminRoute from './components/AdminRoute'; 

// Import des pages
import Home from './pages/Home';
import Login from './pages/Login';         // Page de connexion ADMIN (sécurisée)
import UserLogin from './pages/UserLogin'; // Page de connexion CLIENT
import UserRegister from './pages/UserRegister'; // Page d'inscription CLIENT
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import About from './pages/About';
import CategoryPage from './pages/CategoryPage';
import Shop from './pages/Shop';
import AllCategories from './pages/AllCategories';
import PlaceOrder from './pages/PlaceOrder';
import ProductDetails from './pages/ProductDetails';
import MyOrders from './pages/MyOrders';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* --- ROUTES PUBLIQUES (CLIENTS) --- */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              
              {/* Correction ici : ajout du tiret pour correspondre à la Navbar */}
              <Route path="/my-orders" element={<MyOrders />} />
              
              {/* Panier et Commande */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              
              {/* --- AUTHENTIFICATION CLIENTS --- */}
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* --- ROUTES ADMIN (SÉCURISÉES) --- */}
              
              {/* 1. Page de connexion ADMIN (accessible via /login) */}
              {/* Le composant Login.jsx bloquera les clients non-admin */}
              <Route path="/login" element={<Login />} /> 

              {/* 2. Le Dashboard protégé par AdminRoute */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;