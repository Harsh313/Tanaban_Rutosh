import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import Checkout from "./Checkout";
import { CartItem } from "../types/checkout";

interface RawCartItem {
  id?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  price?: number;
  unit_price?: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  product_image?: string;
  image_url?: string;
}

const convertToCartItems = (cartItems: RawCartItem[]): CartItem[] => {
  return cartItems.map((item) => ({
    id: item.id || item.product_id || "",
    name: item.name || item.product_name || "",
    price: item.price || item.unit_price || 0,
    quantity: item.quantity,
    size: item.size || "",
    color: item.color || "",
    image: item.image || item.product_image || item.image_url || "",
  }));
};

const Cart: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tax = parseFloat((state.total * 0.08).toFixed(2));
  const total = parseFloat((state.total + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>

        <div className="space-y-4">
          {state.items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="relative bg-white rounded shadow p-4 flex items-center justify-between"
            >
              {/* ❌ Remove button */}
              <button
                onClick={() =>
                  removeItem(`${item.id}-${item.size}-${item.color}`)
                }
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <X size={18} />
              </button>

              {/* Product Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-gray-700">Price: ₹{item.price}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      `${item.id}-${item.size}-${item.color}`,
                      item.quantity - 1
                    )
                  }
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-medium px-4">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      `${item.id}-${item.size}-${item.color}`,
                      item.quantity + 1
                    )
                  }
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-white shadow rounded space-y-2">
          <p className="text-lg">Subtotal: ₹{state.total.toFixed(2)}</p>
          <p className="text-lg">Tax (8%): ₹{tax.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-4 px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          cartItems={convertToCartItems(state.items)}
          subtotal={state.total}
          tax={tax}
          shipping={0}
          total={total}
          onOrderComplete={() => {
            clearCart();
            setShowCheckout(false);
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default Cart;
