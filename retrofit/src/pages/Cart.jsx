// ============================================================
// PAGE PANIER
// Cette page affiche les articles que l'utilisateur a ajoutés
// à son panier. Il peut modifier les quantités, supprimer des
// articles, choisir une adresse de livraison et passer commande
// en espèces (COD) ou en ligne via Stripe.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import dummyAddress from "../data/dummyAddress";
import assets from "../assets/assets";
import toast from "react-hot-toast";


const Cart = () => {
    // On récupère tout ce dont on a besoin depuis le contexte global
    const { products, currency, cartItems, setCartItems, deleteFromCart, getCartAmount, updateCartItem, navigate, getCartCount, axios, user, clearCart, setShowUserLogin } = useAppContext();

    // ---- TRANSFORMER LE PANIER EN TABLEAU ----
    // cartItems est un objet { id: quantité }, on le convertit en tableau d'objets produit
    // useMemo évite de recalculer à chaque rendu si cartItems ou products n'ont pas changé
    const cartArray = useMemo(() =>
        Object.keys(cartItems).map(key => {
            const product = products.find(p => p._id === key);
            // On fusionne les infos du produit avec sa quantité dans le panier
            return product ? { ...product, quantity: cartItems[key] } : null;
        }).filter(Boolean), // filter(Boolean) supprime les null (produits introuvables)
        [cartItems, products]
    );

    // ---- CALCULS DU PRIX ----
    // Sous-total = somme de (prix × quantité) pour chaque article
    const subtotal = useMemo(() =>
        cartArray.reduce((sum, p) => sum + p.offerPrice * p.quantity, 0),
        [cartArray]
    );
    // Taxe = 2% du sous-total (arrondi au centime)
    const tax = useMemo(() => Math.floor(subtotal * 0.02 * 100) / 100, [subtotal]);
    // Total final = sous-total + taxe
    const total = useMemo(() => Math.floor((subtotal + tax) * 100) / 100, [subtotal, tax]);

    // ---- ÉTATS POUR LA LIVRAISON ET LE PAIEMENT ----
    const [addresses, setAddresses] = useState([])     // Liste des adresses disponibles
    const [showAddress, setShowAddress] = useState(false)         // Afficher/cacher le menu déroulant d'adresses
    const [selectedAddress, setSelectedAddress] = useState(null)  // Adresse de livraison choisie
    const [paymentoption, setSelectedPaymentOption] = useState('COD') // Mode de paiement (COD ou Online)

    // ---- CHARGER LES ADRESSES DE L'UTILISATEUR ----
    // On essaie de charger les vraies adresses depuis le serveur
    // Si ça échoue, on utilise les adresses de démonstration
    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                if (data.addresses.length > 0) {
                    setAddresses(data.addresses);
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message || 'Impossible de charger les adresses');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ---- PASSER LA COMMANDE ----
    // Cette fonction valide le panier puis envoie la commande au serveur
    const placeOrder = async () => {
        try {
            // Vérifications avant de passer la commande
            if (!user) {
                // L'utilisateur n'est pas connecté → on ouvre le popup de connexion
                toast.error('Veuillez vous connecter pour passer une commande');
                setShowUserLogin(true);
                return;
            }
            if (!selectedAddress) return toast.error('Veuillez sélectionner une adresse');
            if (!selectedAddress._id) {
                // L'adresse de démo n'a pas d'_id réel → on demande d'en ajouter une vraie
                toast.error('Veuillez ajouter une adresse de livraison valide');
                navigate('/add-address');
                return;
            }
            if (cartArray.length === 0) return toast.error('Votre panier est vide');

            // On transforme les articles du panier en format attendu par le serveur
            const items = cartArray.map(p => ({ product: p._id, quantity: p.quantity }));

            if (paymentoption === 'COD') {
                // ---- COMMANDE EN ESPÈCES (COD) ----
                const { data } = await axios.post('/api/order/cod', {
                    items,
                    address: selectedAddress._id
                });
                if (data.success) {
                    toast.success(data.message);
                    clearCart();                // On vide le panier après commande
                    navigate('/my-orders');     // On redirige vers la page des commandes
                } else {
                    toast.error(data.message);
                }
            } else {
                // ---- COMMANDE EN LIGNE (STRIPE) ----
                const { data } = await axios.post('/api/order/stripe', {
                    items,
                    address: selectedAddress._id
                });
                if (data.success) {
                    // Stripe renvoie une URL vers sa page de paiement sécurisée
                    window.location.href = data.url;
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // On charge les adresses seulement si l'utilisateur est connecté
    useEffect(() => {
        if (user) fetchAddresses();
    }, [user])


    // Si le catalogue produit n'est pas encore chargé, on n'affiche rien
    return products.length > 0 ? (
        <div className="flex flex-col md:flex-row mt-16 ">

            {/* ---- PARTIE GAUCHE : Liste des articles dans le panier ---- */}
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Panier produits <span className="text-sm text-primary">{getCartCount()} Articles</span>
                </h1>

                {/* En-têtes du tableau */}
                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">detail du produit</p>
                    <p className="text-center">Total</p>
                    <p className="text-center">Action</p>
                </div>

                {/* Une ligne par article dans le panier */}
                {cartArray.map((product) => (
                    <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            {/* Image cliquable → redirige vers la page détail du produit */}
                            <div onClick={() => {
                                // Certains produits n'ont pas de catégorie en base : on utilise "divers"
                                // comme segment d'URL de secours pour ne pas planter la navigation.
                                const category = (Array.isArray(product.category) ? product.category[0] : product.category) || 'divers';
                                navigate(`/products/${category.toLowerCase()}/${product._id}`);
                                scrollTo(0, 0)
                            }} className="cursor-pointer w-16 h-16 md:w-24 md:h-24 shrink-0 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div className="min-w-0">
                                {/* Nom du produit — tronqué si trop long, visible sur toutes les tailles d'écran */}
                                <p className="font-semibold truncate text-sm md:text-base">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>taille: <span>{product.size || "N/A"}</span></p>
                                    <div className='flex items-center gap-2'>
                                        <p>Qte:</p>
                                        {/* Sélecteur de quantité — la liste va jusqu'à 9 ou la quantité actuelle */}
                                        <select onChange={(e) => updateCartItem(product._id, Number(e.target.value))} value={product.quantity} aria-label={`Quantité pour ${product.name}`} className='outline-none border border-gray-300 rounded px-1'>
                                            {Array(Math.max(product.quantity, 9)).fill('').map((_, i) => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Sous-total de cet article (prix × quantité) */}
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        {/* Bouton poubelle pour supprimer l'article du panier */}
                        <button onClick={() => deleteFromCart(product._id)} aria-label={`Supprimer ${product.name} du panier`} className="cursor-pointer mx-auto text-gray-400 hover:text-red-500 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5a1 1 0 000 2h14a1 1 0 000-2h-4z" />
                            </svg>
                        </button>
                    </div>)
                )}

                {/* Lien pour continuer ses achats */}
                <button onClick={() => { navigate('/products'); scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    ajouter des articles
                </button>

            </div>

            {/* ---- PARTIE DROITE : Fiche de commande (récapitulatif + paiement) ---- */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium"> Fiche de commande  </h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    {/* ---- SÉLECTION DE L'ADRESSE DE LIVRAISON ---- */}
                    <p className="text-sm font-medium uppercase">Addresse de livraison</p>
                    <div className="relative flex justify-between items-start mt-2">
                        {/* Affiche l'adresse sélectionnée */}
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "pas d'address retrouvée"}</p>
                        {/* Bouton pour ouvrir/fermer la liste d'adresses */}
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            modifie
                        </button>
                        {/* Menu déroulant des adresses — visible seulement si showAddress est true */}
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {/* Chaque adresse est cliquable → devient l'adresse sélectionnée */}
                                {addresses.map((address) => (<p key={address._id} onClick={() => { setSelectedAddress(address); setShowAddress(false) }} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street}, {address.city}, {address.state}, {address.country}
                                </p>)
                                )}
                                {/* Lien pour ajouter une nouvelle adresse */}
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    ajouter votre addresse
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ---- SÉLECTION DU MODE DE PAIEMENT ---- */}
                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select onChange={e => setSelectedPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash a la livraison</option>
                        <option value="Online">Paiement en ligne</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                {/* ---- RÉCAPITULATIF DES PRIX ---- */}
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Prix</span><span>{currency}{subtotal}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>livraison</span><span className="text-green-600">gratuite</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{tax}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total :</span><span>{currency}{total}</span>
                    </p>
                </div>

                {/* Bouton commander — le texte change selon le mode de paiement */}
                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary-dull text-white font-medium hover:bg-primary transition">
                    {paymentoption === "COD" ? "payer à la livraison" : "Payer maintenant"}
                </button>
            </div>
        </div>
    ) : null
}
export default Cart;