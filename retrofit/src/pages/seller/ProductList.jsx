// ============================================================
// PAGE LISTE DES PRODUITS (ESPACE VENDEUR)
// Cette page affiche tous les produits dans un tableau.
// Le vendeur peut voir les images, noms, catégories, prix
// et activer/désactiver le stock de chaque produit.
// ============================================================

import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

// Un vrai _id MongoDB fait toujours 24 caractères hexadécimaux.
// Les produits de démonstration (assets.js) utilisent des id factices ("1", "2"...)
// affichés uniquement si le chargement des vrais produits a échoué : on ne veut
// jamais laisser le vendeur essayer de modifier le stock de ces faux produits,
// le serveur refuserait avec "Identifiant de produit invalide".
const isRealProductId = (id) => /^[0-9a-fA-F]{24}$/.test(id)

const ProductList = () => {

    // On récupère la liste des produits et le symbole monétaire depuis le contexte
    const { products, currency, axios, fetchProducts } = useAppContext()

    // On ne garde que les produits ayant un vrai identifiant MongoDB
    const realProducts = products.filter((product) => isRealProductId(product._id))
    const showFallbackWarning = realProducts.length < products.length

    // stockOverrides = modifications temporaires du stock non encore sauvegardées
    // C'est un objet { productId: true/false } pour les changements locaux
    const [stockOverrides, setStockOverrides] = useState({})

    // Cette fonction bascule le stock d'un produit (en stock ↔ épuisé)
    const toggleStock = async (id, inStock)=> {
     try {
        const {data} = await axios.post('/api/product/stock',{id, inStock});
        if (data.success){
            fetchProducts();
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
     } catch (error) {
        toast.error(error.message)
     }
        
    }

    // Cette fonction retourne le statut de stock affiché pour un produit
    // Elle utilise d'abord l'override local, puis la valeur de la base de données
    const isInStock = (product) => {
        return stockOverrides[product._id] !== undefined ? stockOverrides[product._id] : product.inStock
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                {/* Titre de la page */}
                <h2 className="pb-4 text-lg font-medium">Tous les produits </h2>

                {/* Avertissement si la vraie liste de produits n'a pas pu être chargée */}
                {showFallbackWarning && (
                    <div className="mb-4 flex items-center gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <span>
                            Impossible de charger tous les produits depuis le serveur — certains ne sont pas affichés.
                        </span>
                        <button
                            onClick={() => fetchProducts()}
                            className="shrink-0 rounded border border-amber-400 px-3 py-1 font-medium hover:bg-amber-100"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Tableau des produits */}
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">

                        {/* En-têtes du tableau */}
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Produit</th>
                                <th className="px-4 py-3 font-semibold truncate">Categorie</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">Prix de Vente</th>
                                <th className="px-4 py-3 font-semibold truncate">En Stock</th>
                            </tr>
                        </thead>

                        {/* Corps du tableau — une ligne par produit */}
                        <tbody className="text-sm text-gray-500">
                            {realProducts.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20">

                                    {/* Colonne 1 : Image + Nom du produit */}
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 rounded overflow-hidden">
                                            {/* Première image du produit */}
                                            <img src={product.image[0]} alt={product.name} className="w-16 h-16 object-contain" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                    </td>

                                    {/* Colonne 2 : Catégorie */}
                                    <td className="px-4 py-3">{product.category}</td>

                                    {/* Colonne 3 : Prix (caché sur mobile) */}
                                    <td className="px-4 py-3 hidden md:table-cell">{currency}{product.offerPrice}</td>

                                    {/* Colonne 4 : Toggle stock (interrupteur on/off) */}
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            {/* Checkbox cachée qui gère l'état de l'interrupteur */}
                                            <input
                                            onClick={()=> toggleStock(product._id,!product.inStock)} checked={product.inStock}
                                                type="checkbox"
                                                aria-label={`${product.name} en stock`}
                                                className="sr-only peer"

                                            />
                                            {/* Fond de l'interrupteur : gris si off, bleu si on */}
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                                            {/* Bouton rond qui glisse de gauche à droite */}
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ProductList
