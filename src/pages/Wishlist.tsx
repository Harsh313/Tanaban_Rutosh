import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<{ [key: string]: { size: string; color: string; isAdded: boolean } }>({});
  const { addItem } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log("❌ User not logged in");
        setWishlist([]);
        setLoading(false);
        return;
      }

      console.log("✅ Logged in user:", user.id);

      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id, products(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error("❌ Error fetching wishlist:", error);
      } else {
        console.log("✅ Wishlist fetched:", data);
        setWishlist(data);
        // Initialize selections for each product
        const initialSelections = data.reduce((acc: any, item: any) => ({
          ...acc,
          [item.product_id]: {
            size: item.products.sizes?.[0] || 'M',
            color: item.products.colors?.[0] || 'Black',
            isAdded: false,
          },
        }), {});
        setSelections(initialSelections);
      }

      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = (product: any, productId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { size, color } = selections[productId];

    if (!size || !color) {
      alert("Please select size and color");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      size,
      color,
    });

    setSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], isAdded: true },
    }));

    setTimeout(() => {
      setSelections((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isAdded: false },
      }));
    }, 2000);
  };

  const toggleWishlist = (productId: string) => async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ Error fetching user or user not logged in:", userError);
      alert("Please login to manage wishlist");
      return;
    }

    const isWishlisted = wishlist.some((item) => item.product_id === productId);

    if (isWishlisted) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error("❌ Error removing from wishlist:", error);
      } else {
        setWishlist(wishlist.filter((item) => item.product_id !== productId));
        console.log("✅ Product removed from wishlist");
      }
    }
  };

  const handleSelectionChange = (productId: string, field: 'size' | 'color', value: string) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!wishlist.length) return <p className="text-center text-gray-600">No items in wishlist</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-black mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <Link key={item.product_id} to={`/product/${item.product_id}`} className="group block">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.products.image_url}
                  alt={item.products.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={toggleWishlist(item.product_id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                >
                  <Heart
                    className="h-5 w-5 text-red-500 fill-red-500"
                  />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-medium text-black mb-1 group-hover:text-gray-700 transition-colors">
                  {item.products.name}
                </h3>
                <p className="text-xl font-bold text-black">₹{item.products.price}</p>

                {/* Size Selection */}
                {item.products.sizes?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-black mb-2">Size</h4>
                    <div className="flex space-x-2">
                      {item.products.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectionChange(item.product_id, 'size', size);
                          }}
                          className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                            selections[item.product_id]?.size === size
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {item.products.colors?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-black mb-2">Color</h4>
                    <div className="flex space-x-2">
                      {item.products.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectionChange(item.product_id, 'color', color);
                          }}
                          className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                            selections[item.product_id]?.color === color
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart(item.products, item.product_id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    selections[item.product_id]?.isAdded
                      ? 'bg-green-600 text-white'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {selections[item.product_id]?.isAdded ? (
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
        ))}
      </div>
    </div>
  );
}