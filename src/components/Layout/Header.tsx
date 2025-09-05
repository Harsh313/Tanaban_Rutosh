import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X , Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, signOut } = useAuth()
  const { state } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.jpg" 
              alt="RUTOSH Logo" 
              className="h-10 w-10 object-contain rounded-full"
            />
           <div className="w-full max-w-[700px] px-2 sm:px-3 md:px-4 mx-auto">
  <span className="text-base sm:text-xs md:text-s lg:text-2xl font-bold text-black">
    R U T O S H
  </span>
</div>

          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-black transition-colors relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              All Products
            </Link>
            <Link to="/categories/dresses" className="text-gray-700 hover:text-black transition-colors relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Dresses
            </Link>
            <Link to="/categories/tops" className="text-gray-700 hover:text-black transition-colors relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Tops
            </Link>
            <Link to="/categories/bottoms" className="text-gray-700 hover:text-black transition-colors relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Bottoms
            </Link>
            <Link to="/categories/accessories" className="text-gray-700 hover:text-black transition-colors relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Accessories
            </Link>
          </nav>

         

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">

              {/* Wishlist */}
                <Link to="/Wishlist" className="relative p-2 text-gray-700 hover:text-black transition-colors">
                  <Heart className="h-6 w-6" />
                  {/* Wishlist count badge agar chahiye to */}
                  {/* 
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                  */}
                </Link>

            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative group">
                <button className="p-2 text-gray-700 hover:text-black transition-colors">
                  <User className="h-6 w-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-black transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              
              <Link to="/products" className="text-gray-700 hover:text-black transition-colors">
                All Products
              </Link>
              <Link to="/categories/dresses" className="text-gray-700 hover:text-black transition-colors">
                Dresses
              </Link>
              <Link to="/categories/tops" className="text-gray-700 hover:text-black transition-colors">
                Tops
              </Link>
              <Link to="/categories/bottoms" className="text-gray-700 hover:text-black transition-colors">
                Bottoms
              </Link>
              <Link to="/categories/accessories" className="text-gray-700 hover:text-black transition-colors">
                Accessories
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header