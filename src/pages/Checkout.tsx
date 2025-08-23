import React, { useState } from "react";
import { CreditCard, MapPin, ShoppingBag, CheckCircle, Truck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { checkoutService } from "../services/checkoutService";
import { CartItem, CheckoutData } from "../types/checkout";

interface CheckoutProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onOrderComplete: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  onOrderComplete,
  onClose,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    shippingAddress: {
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
    },
    paymentMethod: "razorpay", // default to Razorpay
  });

  const handleInputChange = (
    section: string,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const checkoutData: CheckoutData = {
        items: cartItems,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod as 'razorpay' | 'cod',
        sameAsShipping: true,
      };

      const result = await checkoutService.processCheckout(
        checkoutData,
        user.id,
        user.email || ""
      );

      if (result.success) {
        setOrderId(result.orderId || "");
        setOrderComplete(true);
        onOrderComplete();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            {formData.paymentMethod === 'cod' 
              ? 'Thank you for your order. You can pay when the order is delivered.'
              : 'Thank you for your purchase. Your payment has been processed successfully.'
            }
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-bold text-lg">#{orderId.slice(0, 8)}</p>
          </div>
          {formData.paymentMethod === 'cod' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Cash on Delivery:</strong> Please keep the exact amount ready when our delivery partner arrives.
              </p>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleCheckout}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={formData.shippingAddress.name}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "name",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={formData.shippingAddress.street}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "street",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      handleInputChange(
                        "shippingAddress",
                        "city",
                        e.target.value
                      )
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={formData.shippingAddress.state}
                    onChange={(e) =>
                      handleInputChange(
                        "shippingAddress",
                        "state",
                        e.target.value
                      )
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={formData.shippingAddress.zipCode}
                    onChange={(e) =>
                      handleInputChange(
                        "shippingAddress",
                        "zipCode",
                        e.target.value
                      )
                    }
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={formData.shippingAddress.phone}
                    onChange={(e) =>
                      handleInputChange(
                        "shippingAddress",
                        "phone",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="mr-3"
                    />
                    <CreditCard className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Online Payment</p>
                      <p className="text-sm text-gray-600">
                        Pay securely with UPI, Card, or Net Banking via Razorpay
                      </p>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="mr-3"
                    />
                    <Truck className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">
                        Pay when the order is delivered to your doorstep
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="bg-gray-50 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`}{" "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="flex justify-between text-orange-600">
                    <span>COD Charges</span>
                    <span>₹0</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {formData.paymentMethod === 'cod' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Cash on Delivery:</strong> Please keep exact change ready. 
                    Our delivery partner will collect ₹{total.toFixed(2)} at the time of delivery.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : 
                  formData.paymentMethod === 'cod' 
                    ? `Place Order (₹${total.toFixed(2)})`
                    : `Pay ₹${total.toFixed(2)} with Razorpay`
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;