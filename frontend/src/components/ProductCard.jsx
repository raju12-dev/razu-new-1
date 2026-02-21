import { Plus } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const ProductCard = ({ product }) => {
    const addToCart = useCartStore(state => state.addToCart);

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                    alt={product.name}
                    className="w-full h-48 object-cover object-center"
                />
            </div>
            <div className="p-4 flex flex-col justify-between h-[140px]">
                <div>
                    <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wide">
                        {product.category}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <p className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </p>
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex items-center justify-center p-2 rounded-full bg-blue-50 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={product.inStock ? "Add to cart" : "Out of stock"}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
