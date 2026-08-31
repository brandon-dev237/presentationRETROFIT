// ============================================================
// PAGE TOUS LES PRODUITS
// Cette page affiche tous les articles disponibles dans la boutique.
// Elle filtre aussi les produits selon ce que l'utilisateur recherche.
// ============================================================

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard' // Carte d'un seul produit

const AllProducts = () => {

  // On récupère la liste des produits et la recherche depuis le contexte global
  const { products, searchQuery } = useAppContext()

  // Liste des produits après filtrage (selon la recherche)
  const [filteredProducts, setFilteredProducts] = useState([])

  // Quand les produits ou la recherche changent, on refiltre la liste
  useEffect(() => {
    if (searchQuery.length > 0) {
      // Si l'utilisateur a tapé quelque chose dans la recherche,
      // on garde seulement les produits dont le nom contient ce texte
      // toLowerCase() = on ne tient pas compte des majuscules/minuscules
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      // Si la recherche est vide, on affiche tous les produits
      setFilteredProducts(products)
    }

    // logs de debug pour vérifier le contenu (JSON stringifié pour éviter les objets live)
    try {
      console.log('AllProducts - products', JSON.stringify(products))
    } catch (e) {
      console.log('AllProducts - products (stringify failed)', products)
    }
    try {
      console.log('AllProducts - filteredProducts (state)', JSON.stringify(filteredProducts))
    } catch (e) {
      console.log('AllProducts - filteredProducts (state) (stringify failed)', filteredProducts)
    }

  }, [products, searchQuery]) // Se re-déclenche si products ou searchQuery change

  // Affiche la valeur de filteredProducts après qu'elle change (debug)
  useEffect(() => {
    console.log('AllProducts - filteredProducts (after update)', filteredProducts)
  }, [filteredProducts])

  return (
    <div className='mt-16 flex flex-col'>

      {/* Titre de la page avec un trait décoratif en dessous */}
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>Nos Articles</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {/* Grille de produits — s'adapte selon la taille de l'écran
          2 colonnes sur mobile, 3 sur tablette, 4 sur ordinateur */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6  mt-6'>
        {filteredProducts
          // Pour chaque produit, on affiche une carte produit
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        }
      </div>

    </div>
  )
}

export default AllProducts
