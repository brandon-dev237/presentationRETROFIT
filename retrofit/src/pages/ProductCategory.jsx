// ============================================================
// PAGE CATÉGORIE DE PRODUITS
// Cette page affiche tous les produits d'une seule catégorie.
// Par exemple : /products/doudoune affiche seulement les doudounes.
// ============================================================

import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom' // Pour lire l'URL
import { categories } from '../assets/assets' // Liste de toutes les catégories
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton' // Placeholder pendant le chargement

const ProductCategory = () => {
    // On récupère la liste de tous les produits
    const { products, isProductsLoading } = useAppContext()

    // useParams lit la partie variable de l'URL
    // Si l'URL est /products/doudoune, alors category = "doudoune"
    const { category } = useParams()

    // On cherche dans notre liste de catégories celle qui correspond à l'URL
    // Pour pouvoir afficher le vrai nom (ex: "Vintage Doudoune") et non juste "doudoune"
    const searchCategory = categories.find(
        (item) => item.path.toLowerCase() === category?.toLowerCase()
    )

    // On filtre les produits pour ne garder que ceux de la bonne catégorie
    const filteredProducts = products.filter(
        (product) => {
            // product.category peut être un array, une string, ou absent (produit
            // sans catégorie en base) — on filtre les valeurs vides pour éviter
            // un crash sur cat.toLowerCase() quand cat est undefined.
            const categories = Array.isArray(product.category) ? product.category : [product.category];
            return categories.some(cat => cat && cat.toLowerCase() === category?.toLowerCase());
        }
    )

    return (
        <div className='mt-16'>
            {/* Si la catégorie existe dans notre liste, on affiche son nom */}
            {searchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
            )}

            {/* Pendant le chargement : squelettes animés plutôt qu'un message "aucun produit" trompeur */}
            {isProductsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
            ) : filteredProducts.length > 0 ?(

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {filteredProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
            ):(
             // Si aucun produit n'existe dans cette catégorie, on affiche un message
             <div className='flex items-center justify-center h-[60vh]' >

              <p className='text-2xl font-medium text-primary'  >il y'a aucun produit de cette categorie.</p>
             </div>
            )}
        </div>
    )
}

export default ProductCategory
