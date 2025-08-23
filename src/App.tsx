
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import AboutUs from './components/FootersectionData/AboutUs'
import CancellationPolicy from './components/FootersectionData/CancellationPolicy'
import TermsofService from './components/FootersectionData/TermsofService'
import ContactUs from './components/FootersectionData/ContactUs'
import CustomizeSize from './components/FootersectionData/CustomizeSize'
import SizeChart from './components/FootersectionData/SizeChart'
import ShippingDelivery from './components/FootersectionData/ShippingDelivery'
import WhatsAppButton from './components/Home/WhatsAppButton'
import PrivacyPolicy from './components/FootersectionData/PrivacyPolicy'
import WishlistPage from './pages/Wishlist'
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories/:category" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                 <Route path="/AboutUs" element={<AboutUs />} /> 
                 <Route path="/CancellationPolicy" element={<CancellationPolicy />} /> 
                  <Route path="/TermsofService" element={<TermsofService/>} /> 
                   <Route path="/CustomizeSize" element={<CustomizeSize/>} /> 
                   <Route path="/SizeChart" element={<SizeChart/>}/>
                    <Route path="/ContactUs" element={<ContactUs/>} /> 
                    <Route path="/ShippingDelivery" element={<ShippingDelivery/>} /> 
                    <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
                    <Route path="/Wishlist" element={<WishlistPage/>} />
              </Routes>
              
            </main>
           
            <Footer />
            
          </div>
        </Router>
      </CartProvider>
      <WhatsAppButton/>
      
    </AuthProvider>
  )
}

export default App