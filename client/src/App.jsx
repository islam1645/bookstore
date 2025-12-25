import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import des composants (Navbar, Footer)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import des pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import About from './pages/About';
import CategoryPage from './pages/CategoryPage';
import Shop from './pages/Shop';
import AllCategories from './pages/AllCategories';
import PlaceOrder from './pages/PlaceOrder'; // <--- 1. IMPORT IMPORTANT
import ProductDetails from './pages/ProductDetails'; // Import


function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              {/* Panier et Commande */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/placeorder" element={<PlaceOrder />} /> {/* <--- 2. ROUTE AJOUTÉE */}
              
              <Route path="/login" element={<Login />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              
              {/* Admin */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          <Footer />
          
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;