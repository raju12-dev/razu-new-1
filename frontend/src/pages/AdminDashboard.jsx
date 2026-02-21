import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Package, ShoppingBag, Edit, Trash2, Plus, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // For Adding/Editing Product Modal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', price: '', image: '', category: '', inStock: true });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders') {
                const { data } = await apiClient.get('/orders');
                setOrders(data);
            } else {
                const { data } = await apiClient.get('/products');
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchData(); // Refresh orders
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await apiClient.delete(`/products/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const openProductModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setProductForm({
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                inStock: product.inStock
            });
        } else {
            setCurrentProduct(null);
            setProductForm({ name: '', price: '', image: '', category: '', inStock: true });
        }
        setIsProductModalOpen(true);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                await apiClient.put(`/products/${currentProduct._id}`, productForm);
            } else {
                await apiClient.post('/products', productForm);
            }
            setIsProductModalOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Nav */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Menu</h2>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Manage Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Package className="w-5 h-5" />
                            <span>Manage Products</span>
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white rounded-xl border">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                            {/* ORDERS TAB */}
                            {activeTab === 'orders' && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">#{order._id.substring(18)}</div>
                                                            <div className="text-sm text-gray-500">{order.userId?.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                            ${order.totalAmount.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'Out for delivery' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                                            >
                                                                <option value="Placed">Placed</option>
                                                                <option value="Confirmed">Confirmed</option>
                                                                <option value="Out for delivery">Out for delivery</option>
                                                                <option value="Delivered">Delivered</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {orders.length === 0 && (
                                            <div className="p-8 text-center text-gray-500">No orders found.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* PRODUCTS TAB */}
                            {activeTab === 'products' && (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
                                        <button
                                            onClick={() => openProductModal()}
                                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center shadow-sm"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Product
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {products.map((product) => (
                                                    <tr key={product._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {product.category}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            ${product.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => openProductModal(product)}
                                                                className="text-primary hover:text-blue-900 mr-4"
                                                            >
                                                                <Edit className="w-5 h-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 className="w-5 h-5 inline" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {products.length === 0 && (
                                            <div className="p-8 text-center text-gray-500">No products found.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-xl max-w-lg w-full m-4 shadow-xl">
                        <h3 className="text-xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input required type="text" className="w-full border p-2 rounded-md"
                                    value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input required type="number" step="0.01" className="w-full border p-2 rounded-md"
                                        value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input required type="text" className="w-full border p-2 rounded-md"
                                        value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input required type="url" className="w-full border p-2 rounded-md"
                                    value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center mt-4">
                                <input type="checkbox" id="inStock" className="h-4 w-4 text-primary rounded border-gray-300 mr-2"
                                    checked={productForm.inStock} onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })}
                                />
                                <label htmlFor="inStock" className="text-sm text-gray-900">In Stock</label>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3 pt-6 border-t">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
