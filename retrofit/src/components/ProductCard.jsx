// ============================================================
// COMPOSANT CARTE PRODUIT
// Ce composant affiche un seul produit sous forme de carte.
// Il est réutilisé partout : page d'accueil, liste produits,
// catégories, produits similaires. C'est comme une étiquette
// de produit dans un magasin avec le prix et les boutons.
// ============================================================

import React from "react";
import assets from "../assets/assets"; // Images et icônes
import { useAppContext } from "../context/AppContext";

// Ce composant reçoit un "product" en paramètre (les infos du produit à afficher)
const ProductCard = ({ product }) => {
    // On récupère ce dont on a besoin depuis le contexte global
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    // Si aucun produit n'est fourni, on n'affiche rien
    if (!product) return null;

    return (
        // La carte entière est cliquable → redirige vers la page détail du produit
        <div
            className="border border-gray-500/20 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 bg-white w-full cursor-pointer hover:shadow-md transition"
            onClick={() => {
                // Certains produits n'ont pas de catégorie en base : on utilise "divers"
                // comme segment d'URL de secours pour ne pas planter la navigation.
                const category = (Array.isArray(product.category) ? product.category[0] : product.category) || 'divers';
                navigate(`/products/${category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0)
            }}
        >
            {/* Image du produit */}
            <div className="w-full h-24 sm:h-32 md:h-40 flex items-center justify-center overflow-hidden">
                <img
                    className="w-full h-full object-contain"
                    src={product.image[0]} // On affiche la première image
                    alt={product.name}
                />
            </div>

            <div className="mt-1 sm:mt-2">
                {/* Catégorie du produit (en petit, grisé) */}
                <p className="text-[clamp(0.55rem,1.5vw,0.75rem)] text-gray-500/60 truncate">{Array.isArray(product.category) ? product.category[0] : product.category}</p>

                {/* Nom du produit */}
                <p className="text-[clamp(0.65rem,1.8vw,1rem)] font-medium text-gray-700 truncate w-full leading-tight">
                    {product.name}
                </p>

                {/* Étoiles de notation (5 étoiles fixes pour l'instant) */}
                <div className="flex items-center gap-0.5 mt-0.5">
                    {Array(5).fill('').map((_, i) => (
                        <span key={i} className="text-[clamp(0.5rem,1.5vw,0.75rem)]">⭐</span>
                    ))}
                    <p className="text-[clamp(0.5rem,1.5vw,0.7rem)] text-gray-500/60 ml-0.5">(4)</p>
                </div>

                {/* Prix et bouton panier */}
                <div className="flex items-end justify-between mt-1.5 sm:mt-3">
                    {/* Prix du produit */}
                    <div>
                        {/* Si le prix d'offre est inférieur au prix normal → on barre l'ancien prix */}
                        {product.offerPrice < product.price && (
                            <p className="text-[clamp(0.5rem,1.3vw,0.75rem)] text-gray-400 line-through">{currency}{product.price}</p>
                        )}
                        {/* Prix actuel en couleur primaire */}
                        <p className="text-[clamp(0.7rem,2vw,1.25rem)] font-medium text-primary">
                            {currency}{product.offerPrice}
                        </p>
                    </div>

                    {/* Zone bouton — on arrête la propagation du clic pour ne pas
                        naviguer vers la page produit en cliquant sur +/- */}
                    <div onClick={(e) => e.stopPropagation()}>
                        {/* Si l'article N'EST PAS dans le panier → bouton "Ajouter" */}
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary border border-primary w-[48px] sm:w-[60px] md:w-[80px] h-[26px] sm:h-[30px] md:h-[34px] rounded text-white text-[0.6rem] sm:text-xs md:text-sm"
                                onClick={() => addToCart(product._id)}
                                aria-label={`Ajouter ${product.name} au panier`}
                            >
                                <img src={assets.nav_cart_icon} alt="cart" className="w-2.5 sm:w-3 md:w-4" />
                                <span className="hidden sm:inline">ajouter</span>
                                <span className="sm:hidden">+</span>
                            </button>
                        ) : (
                            // Si l'article EST dans le panier → afficher la quantité avec +/-
                            <div className="flex items-center justify-center gap-1 w-[48px] sm:w-[60px] md:w-20 h-[26px] sm:h-[30px] md:h-[34px] bg-primary/25 rounded select-none text-[0.65rem] sm:text-sm">
                                {/* Bouton - : retire un article du panier */}
                                <button onClick={() => removeFromCart(product._id)} aria-label={`Retirer un exemplaire de ${product.name} du panier`} className="px-1 md:px-2 font-bold">-</button>
                                {/* Quantité actuelle dans le panier */}
                                <span className="w-3 sm:w-4 text-center" aria-label={`Quantité : ${cartItems[product._id]}`}>{cartItems[product._id]}</span>
                                {/* Bouton + : ajoute un article au panier */}
                                <button onClick={() => addToCart(product._id)} aria-label={`Ajouter un exemplaire de ${product.name} au panier`} className="px-1 md:px-2 font-bold">+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
