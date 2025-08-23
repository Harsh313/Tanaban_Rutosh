import { supabase } from '../lib/supabase'
import { CheckoutData } from '../types/checkout'

// Add this interface for Razorpay
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const checkoutService = {
  // Create Razorpay order using Supabase Edge Function
  createRazorpayOrder: async (amount: number, currency: string = 'INR') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount,
          currency
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw error;
    }
  },

  // Verify Razorpay payment using Supabase Edge Function
  verifyRazorpayPayment: async (paymentData: RazorpayResponse) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: paymentData
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  },

  // Process checkout with Razorpay integration and COD support
  processCheckout: async (
    checkoutData: CheckoutData, 
    userId: string, 
    userEmail: string
  ): Promise<{ success: boolean; orderId?: string; message: string }> => {
    try {
      // For Cash on Delivery, process directly
      if (checkoutData.paymentMethod === 'cod') {
        return await checkoutService.createOrderInDatabase(checkoutData, userId, userEmail, {
          payment_status: 'pending',
          payment_method: 'cod',
          razorpay_order_id: null,
          razorpay_payment_id: null
        });
      }

      // For card payments, use Razorpay
      const razorpayOrder = await checkoutService.createRazorpayOrder(checkoutData.total);

      if (!razorpayOrder.success) {
        throw new Error('Failed to create Razorpay order');
      }

      return new Promise((resolve) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Your Store Name',
          description: 'Purchase from Your Store',
          order_id: razorpayOrder.id,
          prefill: {
            name: checkoutData.shippingAddress.name,
            email: userEmail,
            contact: checkoutData.shippingAddress.phone
          },
          theme: {
            color: '#000000'
          },
          handler: async (response: RazorpayResponse) => {
            try {
              // Verify payment on backend
              const verification = await checkoutService.verifyRazorpayPayment(response);
              
              if (verification.success && verification.verified) {
                // Create order in database after successful payment
                const orderResult = await checkoutService.createOrderInDatabase(
                  checkoutData, 
                  userId, 
                  userEmail,
                  {
                    payment_status: 'completed',
                    payment_method: 'razorpay',
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id
                  }
                );

                resolve(orderResult);
              } else {
                resolve({
                  success: false,
                  message: 'Payment verification failed'
                });
              }
            } catch (error) {
              console.error('Payment handler error:', error);
              resolve({
                success: false,
                message: 'Payment processing failed'
              });
            }
          },
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                message: 'Payment cancelled by user'
              });
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });

    } catch (error) {
      console.error('Checkout error:', error);
      return {
        success: false,
        message: 'Failed to process payment. Please try again.'
      };
    }
  },

  // Create order in database (separated for reuse)
  createOrderInDatabase: async (
    checkoutData: CheckoutData, 
    userId: string, 
    userEmail: string,
    paymentInfo: {
      payment_status: string;
      payment_method: string;
      razorpay_order_id?: string | null;
      razorpay_payment_id?: string | null;
    }
  ) => {
    try {
      // Insert the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          user_email: userEmail,
          user_name: checkoutData.shippingAddress.name,
          shipping_address: checkoutData.shippingAddress,
          billing_address: checkoutData.sameAsShipping ? checkoutData.shippingAddress : checkoutData.billingAddress,
          items: checkoutData.items,
          subtotal: checkoutData.subtotal,
          tax: checkoutData.tax,
          shipping_cost: checkoutData.shipping,
          total_amount: checkoutData.total,
          payment_method: paymentInfo.payment_method,
          status: 'confirmed',
          payment_status: paymentInfo.payment_status,
          razorpay_order_id: paymentInfo.razorpay_order_id,
          razorpay_payment_id: paymentInfo.razorpay_payment_id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = checkoutData.items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Store payment record if it's a card payment
      if (paymentInfo.payment_method === 'razorpay' && paymentInfo.razorpay_payment_id) {
        await supabase
          .from('payments')
          .insert({
            order_id: order.id,
            razorpay_order_id: paymentInfo.razorpay_order_id,
            razorpay_payment_id: paymentInfo.razorpay_payment_id,
            amount: checkoutData.total,
            currency: 'INR',
            status: 'completed',
            gateway: 'razorpay'
          });
      }

      // Notify admin
      await checkoutService.notifyAdmin(order);

      return {
        success: true,
        orderId: order.id,
        message: paymentInfo.payment_method === 'cod' 
          ? 'Order placed successfully! You can pay when the order is delivered.'
          : 'Order confirmed successfully!'
      };
    } catch (error) {
      console.error('Database order creation error:', error);
      return {
        success: false,
        message: 'Failed to create order. Please contact support.'
      };
    }
  },

  notifyAdmin: async (order: any) => {
    try {
      await supabase
        .from('admin_notifications')
        .insert({
          type: 'new_order',
          title: 'New Order Received',
          message: `New order #${order.id.slice(0, 8)} for ₹${order.total_amount} from ${order.user_email}`,
          order_id: order.id
        });
    } catch (error) {
      console.error('Admin notification error:', error);
    }
  },

  // Get order details
  getOrder: async (orderId: string) => {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { success: true, order };
    } catch (error) {
      console.error('Get order error:', error);
      return { success: false, message: 'Failed to fetch order details' };
    }
  },

  // Get user orders
  getUserOrders: async (userId: string) => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, orders };
    } catch (error) {
      console.error('Get user orders error:', error);
      return { success: false, message: 'Failed to fetch orders' };
    }
  }
};