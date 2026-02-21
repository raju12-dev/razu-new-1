import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <li key={item.product} className="p-4 sm:p-6 flex items-center">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-100" />

                            <div className="ml-6 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                                </div>

                                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:space-x-8">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-medium">{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product, item.qty + 1)}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-base font-medium text-gray-900">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">${getCartTotal().toFixed(2)}</p>
                    </div>

                    <Link
                        to="/checkout"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600 transition-colors"
                    >
                        Proceed to Checkout
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
