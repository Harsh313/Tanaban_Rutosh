import React     from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { supabase } from '../../lib/supabase'
import { useEffect } from 'react'


interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  description: string
  // sizes: string[]
  // colors: string[]
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart()
  // const [selectedSize, setSelectedSize] = React.useState(product.sizes[0] || 'M')
  // const [selectedColor, setSelectedColor] = React.useState(product.colors[0] || 'Black')
  const [isAdded, setIsAdded] = React.useState(false)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  
useEffect(() => {
  const fetchWishlistStatus = async () => {
    console.log("🔍 Checking wishlist status for product:", product.id)

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log("👤 User from supabase.auth.getUser:", user, "Error:", userError)

    if (!user) {
      console.info("ℹ No user logged in — skipping wishlist check")
      return
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single()

    console.log("📌 Wishlist query result:", { data, error })

    if (data) {
      setIsWishlisted(true)
    }
  }

  fetchWishlistStatus()
}, [product.id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("🖱️ Wishlist toggle clicked for product:", product.id)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("❌ Error fetching user:", userError)
      return
    }
    if (!user) {
      console.log("⚠️ No user logged in — cannot manage wishlist")
      alert("Please login to manage wishlist")
      return
    }

    if (isWishlisted) {
      console.log("🗑 Removing product from wishlist...")
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id)

      if (error) {
        console.error("❌ Error removing from wishlist:", error)
      } else {
        console.log("✅ Product removed from wishlist")
        setIsWishlisted(false)
      }
    } else {
      console.log("➕ Adding product to wishlist...")
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: user.id, product_id: product.id }])

      if (error) {
        console.error("❌ Error adding to wishlist:", error)
      } else {
        console.log("✅ Product added to wishlist")
        setIsWishlisted(true)
      }
    }
  }


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1, 
       size: 'M', // default
       color: 'Black' // default
    })
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

 




  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:shadow-md transition-shadow"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-400"
              }`}
            />
          </button>
         
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-black mb-1 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
        
          <p className="text-xl font-bold text-black">₹{product.price}</p>
          
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              isAdded
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isAdded ? (
              <span className="flex items-center justify-center">
                ✓ Added to Cart
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </span>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard