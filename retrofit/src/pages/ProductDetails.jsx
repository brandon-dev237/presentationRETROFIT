// ============================================================
// PAGE DÉTAIL D'UN PRODUIT
// Cette page affiche toutes les informations d'un seul produit :
// ses images, son prix, sa description, et les boutons pour
// l'ajouter au panier. Elle montre aussi des produits similaires.
// ============================================================

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Pour lire l'ID du produit dans l'URL
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
    // On lit l'identifiant du produit depuis l'URL (/products/categorie/ID)
    const { id } = useParams();

    // On récupère les données nécessaires depuis le contexte global
    const { products, currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    // On cherche le produit dont l'ID correspond à celui dans l'URL
    const product = products.find(p => p._id === id);

    // Index de l'image actuellement affichée en grand (0 = première image)
    const [thumbnail, setThumbnail] = useState(0);

    // Liste des produits de la même catégorie (pour la section "Produits similaires")
    const [relatedProducts, setRelatedproducts] = useState([]);

    // Quand on trouve le produit, on cherche les produits similaires
    useEffect(() => {
        if (product) {
            // On fait une copie de la liste de produits pour ne pas modifier l'originale
            let productscopy = products.slice();
            // On filtre pour ne garder que les produits de la même catégorie
            productscopy = productscopy.filter((item) => product.category === item.category);
            // On prend au maximum 5 produits similaires
            setRelatedproducts(productscopy.slice(0, 5));
        }
    }, [product]); // Se re-déclenche si le produit change

    // Quand on change de produit, on réaffiche la première image
    useEffect(() => {
        setThumbnail(0);
    }, [product]);

    // Si le produit n'est pas trouvé (ID invalide), on affiche un message d'erreur
    if (!product) return (
        <div className="flex items-center justify-center h-[60vh]">
            <p className="text-2xl font-medium text-primary">Produit introuvable.</p>
        </div>
    );

    return (
        <div className="max-w-6xl w-full px-6 mt-16">
            {/* Fil d'Ariane : Accueil > Produits > Catégorie > Nom du produit */}
            {/* Chaque partie est cliquable pour naviguer facilement */}
            <p className="text-sm text-gray-500">
                <span className="cursor-pointer hover:underline" onClick={() => navigate("/")}>Accueil</span> /
                <span className="cursor-pointer hover:underline" onClick={() => navigate("/products")}> Produits</span> /
                <span className="cursor-pointer hover:underline" onClick={() => navigate(`/products/${product.category.toLowerCase()}`)}> {product.category}</span> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-6">

                {/* Section images du produit */}
                <div className="flex flex-col gap-3">
                    {/* Image principale — affiche l'image sélectionnée (thumbnail) */}
                    <div className="border border-gray-500/30 w-full md:max-w-sm rounded overflow-hidden">
                        <img src={product.image[thumbnail]} alt={product.name} className="w-full object-cover" />
                    </div>

                    {/* Miniatures des autres images — s'affiche seulement s'il y a plusieurs images */}
                    {product.image.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {product.image.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setThumbnail(index)} // Clic = changer l'image principale
                                    // Si c'est la miniature sélectionnée, on met un bord coloré
                                    className={`border shrink-0 w-16 h-16 rounded overflow-hidden cursor-pointer ${thumbnail === index ? "border-primary" : "border-gray-500/30"}`}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section informations du produit */}
                <div className="text-sm w-full md:w-1/2">
                    {/* Nom du produit */}
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Étoiles de notation (affichage fixe de 5 étoiles) */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <span key={i}>⭐</span>
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    {/* Prix du produit */}
                    <div className="mt-6">
                        {/* Si le prix d'offre est inférieur au prix normal, on barre le prix normal */}
                        {product.offerPrice < product.price && (
                            <p className="text-gray-500/70 line-through">Prix : {currency}{product.price}</p>
                        )}
                        {/* Prix actuel (avec réduction) */}
                        <p className="text-2xl font-medium">Prix : {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(toutes taxes comprises)</span>
                    </div>

                    {/* Boutons Ajouter au panier / Commander */}
                    <div className="flex items-center mt-10 gap-4 text-base">
                        {/* Si l'article n'est PAS dans le panier, on affiche "Ajouter au panier" */}
                        {!cartItems[product._id] ? (
                            <button
                                onClick={() => addToCart(product._id)}
                                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                            >
                                Ajouter au panier
                            </button>
                        ) : (
                            // Si l'article EST dans le panier, on affiche les boutons +/-
                            <div className="flex items-center justify-center gap-4 w-full py-3.5 bg-primary/25 rounded">
                                {/* Bouton - : diminue la quantité de 1 */}
                                <button onClick={() => removeFromCart(product._id)} className="px-4 text-xl font-bold">-</button>
                                {/* Quantité actuelle dans le panier */}
                                <span className="w-6 text-center">{cartItems[product._id]}</span>
                                {/* Bouton + : augmente la quantité de 1 */}
                                <button onClick={() => addToCart(product._id)} className="px-4 text-xl font-bold">+</button>
                            </div>
                        )}
                        {/* Bouton commander maintenant */}
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition rounded">
                            Commandes Maintenant
                        </button>
                    </div>
                </div>
            </div>

            {/* Section produits similaires */}
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Produits similaires</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                {/* Grille des produits similaires en stock */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts.filter((product) => product.inStock).map(
                        (product, index) => (
                            <ProductCard key={index} product={product} />
                        )
                    )}

                </div>
                {/* Bouton pour voir tous les produits */}
                <button  onClick={() => { navigate('/products'); scrollTo(0, 0); }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">voir plus</button>
            </div>
        </div>
    );
};

export default ProductDetails;
