import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Ruler } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import SizeChart from "../components/FootersectionData/SizeChart";
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        setSelectedSize(data.sizes[0] || "");
        setSelectedColor(data.colors[0] || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              Product not found
            </h1>
            <button
              onClick={() => navigate("/products")}
              className="text-black hover:text-gray-700"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
             
              <h1 className="text-3xl font-bold text-black mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-black">
                  ₹{product.price}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "This beautiful piece combines comfort with style, perfect for the modern woman who values both elegance and practicality. Crafted with attention to detail and designed to complement your lifestyle."}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Size</h3>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                 
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Color</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-black mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
              {/* Size chart */}
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <Link
                      to="/SizeChart"
                      className="relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
                    >
                      Size Chart
                    </Link>
                  </div>
            {/* Add to Cart */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center">
                    ✓ Added to Cart
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </span>
                )}
              </button>
            </div>

            <button
              // onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-lg font-medium bg-yellow-500 text-black hover:bg-yellow-600 transition-all duration-200"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
