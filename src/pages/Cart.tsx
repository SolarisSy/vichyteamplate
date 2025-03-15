import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart, updateProductQuantity } from "../features/cart/cartSlice";
import { ProductImage, PaymentModal } from "../components";
import { formatCategoryName } from "../utils/formatCategoryName";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, totalAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const handleRemoveItem = (id: string) => {
    dispatch(removeProductFromTheCart(id));
    toast.success("Item removed from cart");
  };
  
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    dispatch(updateProductQuantity({ id, quantity }));
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-xl text-gray-600 mb-8">Your cart is currently empty.</p>
        <Link 
          to="/shop" 
          className="inline-block bg-secondaryBrown text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <ProductImage 
                            src={item.image} 
                            alt={item.title} 
                            className="h-16 w-16 object-cover rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCategoryName(item.category)}
                          </div>
                          {item.size && (
                            <div className="text-sm text-gray-500">
                              Size: {item.size}
                            </div>
                          )}
                          {item.color && (
                            <div className="text-sm text-gray-500">
                              Color: {item.color}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          -
                        </button>
                        <span className="mx-2 text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <button 
              onClick={handleOpenPaymentModal}
              className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Pagar com PIX
            </button>
            <Link 
              to="/checkout" 
              className="block w-full bg-secondaryBrown text-white text-center px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento PIX */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        cartItems={cartItems}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default Cart;
