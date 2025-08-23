import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
  size: string
  color: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART'; payload?: undefined }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
}

// Helper function to parse item key properly - matches Cart component format
const parseItemKey = (key: string) => {
  console.log('Parsing key:', key);
  
  // Split by last two hyphens to get size and color
  const parts = key.split('-');
  if (parts.length < 3) {
    console.warn('Invalid key format:', key);
    return { id: key, size: undefined, color: undefined };
  }
  
  // The color is the last part, size is second to last, everything else is the ID
  let color = parts[parts.length - 1];
  let size = parts[parts.length - 2];
  const id = parts.slice(0, -2).join('-');
  
  // Convert 'nocolor' and 'nosize' back to undefined to match stored items
  if (color === 'nocolor') color = undefined;
  if (size === 'nosize') size = undefined;
  
  console.log('Parsed:', { id, size, color });
  return { id, size, color };
};

// Helper function to generate item key - matches Cart component format
const generateItemKey = (item: CartItem) => {
  const size = (item.size === undefined || item.size === null || item.size === '') ? 'nosize' : item.size;
  const color = (item.color === undefined || item.color === null || item.color === '') ? 'nocolor' : item.color;
  return `${item.id}-${size}-${color}`;
};

// Helper function to calculate totals with proper rounding
const calculateTotals = (items: CartItem[]) => {
  const total = parseFloat(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('CartReducer action:', action.type, action.payload);
  console.log('Current state before action:', state);
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      );

      let newItems: CartItem[];
      if (existingItemIndex !== -1) {
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
      } else {
        newItems = [...state.items, action.payload];
      }
      
      const { total, itemCount } = calculateTotals(newItems);
      const newState = { items: newItems, total, itemCount };
      console.log('ADD_ITEM - New state:', newState);
      return newState;
    }

    case 'REMOVE_ITEM': {
      const { id, size, color } = parseItemKey(action.payload);
      const newItems = state.items.filter(item => 
        !(item.id === id && item.size === size && item.color === color)
      );
      
      const { total, itemCount } = calculateTotals(newItems);
      const newState = { items: newItems, total, itemCount };
      console.log('REMOVE_ITEM - New state:', newState);
      return newState;
    }

    case 'UPDATE_QUANTITY': {
      const { id, size, color } = parseItemKey(action.payload.id);
      console.log('UPDATE_QUANTITY - Looking for item:', { id, size, color });
      console.log('Available items:', state.items.map(item => ({ 
        id: item.id, 
        size: item.size, 
        color: item.color, 
        key: generateItemKey(item) 
      })));
      
      let itemFound = false;
      const newItems = state.items.map(item => {
        // Handle undefined/null comparisons properly
        const sizeMatches = (item.size === undefined || item.size === null || item.size === '') 
          ? (size === undefined || size === null || size === '') 
          : item.size === size;
        const colorMatches = (item.color === undefined || item.color === null || item.color === '') 
          ? (color === undefined || color === null || color === '') 
          : item.color === color;
        const matches = item.id === id && sizeMatches && colorMatches;
        
        console.log(`Checking item ${item.id}-${item.size}-${item.color}: matches = ${matches}`);
        console.log(`  - ID match: ${item.id === id}`);
        console.log(`  - Size match: ${sizeMatches} (item.size: ${item.size}, target: ${size})`);
        console.log(`  - Color match: ${colorMatches} (item.color: ${item.color}, target: ${color})`);
        
        if (matches) {
          console.log('Found matching item:', item, 'updating quantity from', item.quantity, 'to:', action.payload.quantity);
          itemFound = true;
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      if (!itemFound) {
        console.warn('UPDATE_QUANTITY - Item not found for key:', action.payload.id);
        console.warn('Available items:', state.items.map(item => generateItemKey(item)));
        return state; // Return current state if item not found
      }

      const { total, itemCount } = calculateTotals(newItems);
      const newState = { items: newItems, total, itemCount };
      console.log('UPDATE_QUANTITY - New state:', newState);
      return newState;
    }

    case 'CLEAR_CART':
      console.log('CLEAR_CART - Clearing cart');
      return { ...initialState };

    case 'LOAD_CART': {
      if (!Array.isArray(action.payload)) {
        console.warn('LOAD_CART - Invalid payload, expected array:', action.payload);
        return state;
      }
      
      const { total, itemCount } = calculateTotals(action.payload);
      const newState = { items: action.payload, total, itemCount };
      console.log('LOAD_CART - New state:', newState);
      return newState;
    }

    default:
      console.log('Unknown action type:', (action as any).type);
      return state;
  }
};

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('tanabana-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          console.log('Loading cart from localStorage:', parsedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('tanabana-cart');
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    try {
      localStorage.setItem('tanabana-cart', JSON.stringify(state.items));
      console.log('Saved to localStorage:', state.items);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (item: CartItem) => {
    console.log('CartProvider.addItem called with:', item);
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    console.log('CartProvider.removeItem called with key:', id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('CartProvider.updateQuantity called with key:', id, 'quantity:', quantity);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    console.log('CartProvider.clearCart called');
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};