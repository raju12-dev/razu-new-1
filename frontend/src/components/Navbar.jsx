import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { cartItems } = useCartStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                                HyperLocal
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user?.isAdmin && (
                            <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                                Admin Dashboard
                            </Link>
                        )}

                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-destructive rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4 ml-4">
                                <Link to="/orders" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-destructive transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                                <UserIcon className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
