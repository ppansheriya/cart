import { useState } from 'react';
import Navbar from "./Navbar.jsx";

const paintingImages = [
    { id: 1, src: 'https://picsum.photos/400/300?random=1', title: 'Random Artwork 1' },
    { id: 2, src: 'https://picsum.photos/400/300?random=2', title: 'Random Artwork 2' },
    { id: 3, src: 'https://picsum.photos/400/300?random=3', title: 'Random Artwork 3' },
    { id: 4, src: 'https://picsum.photos/400/300?random=4', title: 'Random Artwork 4' },
    { id: 5, src: 'https://picsum.photos/400/300?random=5', title: 'Random Artwork 5' },
    { id: 6, src: 'https://picsum.photos/400/300?random=6', title: 'Random Artwork 6' },
    { id: 7, src: 'https://picsum.photos/400/300?random=7', title: 'Random Artwork 7' },
    { id: 8, src: 'https://picsum.photos/400/300?random=8', title: 'Random Artwork 8' },
];

const PaintingTiles = () => {
    const [cart, setCart] = useState([]);

    const addToCart = (painting) => {
        setCart([...cart, painting]);
    };
    const removeFromCart = (painting) => {
        const updatedCart = cart.filter((item) => item.id !== painting.id);
        setCart(updatedCart);
    };
    const isInCart = (paintingId) => {
        return cart.some(item => item.id === paintingId);
    };

    return (
        <div>
            <Navbar cartCount={cart.length}/>
            <div className="p-6">
                <div className="container">
                    {paintingImages.map((painting) => (
                        <div key={painting.id} className="card-item">
                            <img
                                src={painting.src}
                                alt={painting.title}
                                className="w-full h-40 object-cover rounded-lg shadow-md"
                            />
                            {isInCart(painting.id) ? (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => removeFromCart(painting)}
                                >
                                    Remove from Cart
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => addToCart(painting)}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaintingTiles;
