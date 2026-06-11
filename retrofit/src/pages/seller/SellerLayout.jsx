// ============================================================
// MISE EN PAGE DE L'ESPACE VENDEUR
// Ce composant est la structure commune de toutes les pages vendeur.
// Il contient la barre du haut (avec logo et bouton déconnexion)
// et la barre latérale gauche avec les liens de navigation vendeur.
// C'est comme le cadre d'un tableau de bord administrateur.
// ============================================================

// NavLink = lien de navigation (change de couleur quand la page est active)
// Outlet = espace réservé où s'affichent les pages enfants (AddProduct, ProductList, Orders)
// Link = lien simple
import { NavLink, Outlet, Link } from "react-router-dom";
import assets from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {

    // On récupère axios (pour la déconnexion) et navigate (pour la redirection)
    const { axios, navigate } = useAppContext();


    // Liste des liens dans la barre latérale gauche
    // Chaque lien a un nom, un chemin (URL) et une icône
    const sidebarLinks = [
        { name: "Ajouter un produit", path: "/seller", icon: assets.add_icon },
        { name: "Liste des produits", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Commande", path: "/seller/orders", icon: assets.order_icon},
    ];


    // Fonction de déconnexion du vendeur
    const logout = async ()=>{
         try {
            // On appelle le serveur pour supprimer le cookie vendeur
            const { data } = await axios.get('/api/seller/logout');
            if(data.success){
                // Déconnexion réussie → notification et redirection vers l'accueil
                toast.success(data.message)
                navigate('/')

            }else{
             toast.error(data.message)
            }
         } catch (error) {
             toast.error(error.message)
         }
       }


    return (
        // Conteneur principal qui prend toute la hauteur de l'écran
        <div className="flex flex-col min-h-screen">

            {/* ---- BARRE DU HAUT ---- */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                {/* Logo cliquable → retour à l'accueil public */}
                <Link to="/">
                    <img src={assets.logo} alt="RetroFit" className="cursor-pointer w-32 md:w-38" />
                </Link>
                {/* Message de bienvenue et bouton de déconnexion */}
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Bonjour! Admin</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 cursor-pointer'>se déconnecter</button>
                </div>
            </div>

            {/* ---- CORPS PRINCIPAL : barre latérale + contenu ---- */}
            <div className="flex flex-1">

                {/* ---- BARRE LATÉRALE GAUCHE (NAVIGATION) ---- */}
                <div className="md:w-64 w-16 border-r text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {/* On affiche chaque lien de la barre latérale */}
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name}
                            // end = active seulement si le chemin correspond EXACTEMENT (pour /seller)
                            end={item.path === "/seller"}
                            // La classe change selon si le lien est actif ou non
                            // Lien actif = fond coloré + bord gauche de couleur primaire
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3
                                ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            {/* Icône du lien */}
                            <img src={item.icon} alt="" className="w-7 h-7 object-contain" />
                            {/* Texte du lien — caché sur mobile (md:block hidden) */}
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>

                {/* ---- ZONE DE CONTENU PRINCIPALE ---- */}
                {/* Outlet affiche ici la page enfant active :
                    - /seller → AddProduct
                    - /seller/product-list → ProductList
                    - /seller/orders → Orders */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default SellerLayout;
