import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import apiClient from '../api/client';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: cartItems,
                address,
                paymentMethod: 'COD',
                totalAmount: getCartTotal(),
            };

            const { data } = await apiClient.post('/orders', orderData);
            clearCart();
            navigate(`/orders`, { state: { newOrderId: data._id } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
                <form onSubmit={handlePlaceOrder} className="space-y-8">
                    <div>
                        <h2 className="text-xl font-medium text-gray-900 mb-4">Delivery Address</h2>
                        {error && (
                            <div className="mb-4 bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary shadow-sm"
                            placeholder="Enter your full delivery address..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.product} className="py-3 flex justify-between">
                                        <span className="text-gray-600">
                                            {item.qty} x {item.name}
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-900">Total to Pay (COD)</span>
                                <span className="text-2xl font-bold text-primary">
                                    ${getCartTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Order (Cash on Delivery)'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
