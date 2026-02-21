import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],

    addToCart: (product) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find(item => item.product === product._id);

        let updatedItems;
        if (existingItem) {
            updatedItems = currentItems.map(item =>
                item.product === product._id ? { ...item, qty: item.qty + 1 } : item
            );
        } else {
            updatedItems = [...currentItems, {
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: 1
            }];
        }

        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        set({ cartItems: updatedItems });
    },

    removeFromCart: (productId) => {
        const updatedItems = get().cartItems.filter(item => item.product !== productId);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        set({ cartItems: updatedItems });
    },

    updateQuantity: (productId, qty) => {
        const updatedItems = get().cartItems.map(item =>
            item.product === productId ? { ...item, qty: Number(qty) } : item
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        set({ cartItems: updatedItems });
    },

    clearCart: () => {
        localStorage.removeItem('cartItems');
        set({ cartItems: [] });
    },

    getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    }
}));

export default useCartStore;
