import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';
import { Loader2, Package, CheckCircle2, Truck, Home as HomeIcon } from 'lucide-react';

const OrderStatusSteps = ({ status }) => {
    const steps = [
        { name: 'Placed', icon: Package },
        { name: 'Confirmed', icon: CheckCircle2 },
        { name: 'Out for delivery', icon: Truck },
        { name: 'Delivered', icon: HomeIcon },
    ];

    const currentStepIndex = steps.findIndex(s => s.name === status);
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
        <div className="py-4">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <div key={step.name} className="relative flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 transition-colors duration-300 ${isCompleted
                                        ? 'bg-primary border-blue-100 text-white'
                                        : 'bg-white border-gray-200 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-blue-50' : ''}`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`mt-2 text-xs font-medium sm:text-sm absolute -bottom-6 w-max ${isCompleted ? 'text-primary' : 'text-gray-500'
                                }`}>
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuthStore();
    const location = useLocation();
    const newOrderId = location.state?.newOrderId;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await apiClient.get(`/orders/user/${user._id}`);
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            {newOrderId && (
                <div className="mb-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Order Successfully Placed!</h2>
                    <p className="text-green-700">Thank you for your purchase. We are processing your order.</p>
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-dashed">
                    <p className="mb-4">You haven't placed any orders yet.</p>
                    <Link to="/" className="text-primary font-medium hover:underline">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order._id}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-2 sm:mt-0 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                                    Total: ${order.totalAmount.toFixed(2)}
                                </div>
                            </div>

                            <div className="mb-8 px-4">
                                <OrderStatusSteps status={order.status} />
                            </div>

                            <div className="mt-8">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Items</h4>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {order.items.map(item => (
                                        <div key={item._id || item.product} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.qty} | ${(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
