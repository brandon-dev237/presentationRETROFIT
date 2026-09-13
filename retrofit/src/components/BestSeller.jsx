// ============================================================
// COMPOSANT MEILLEURES VENTES
// Ce composant affiche les 5 premiers produits disponibles
// dans la section "Tendances du Moment" de la page d'accueil.
// Il sert de vitrine pour attirer l'attention des visiteurs.
// ============================================================

import React from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  // On récupère la liste de tous les produits depuis le contexte global
  const { products, isProductsLoading } = useAppContext();

  return (
    <div id="tendances-du-moment" className="mt-16 scroll-mt-24">

      {/* Titre de la section */}
      <p className="text-2xl md:text-3xl font-medium">
        Tendances du Moment
      </p>

      {/* Grille des produits vedettes
          On filtre pour ne garder que les produits en stock,
          puis on prend les 5 premiers avec .slice(0, 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {isProductsLoading
          // Pendant le chargement : squelettes animés plutôt qu'une grille vide
          ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : products
            .filter((product) => product.inStock) // Seulement les produits disponibles
            .slice(0, 5)                           // On limite à 5 produits
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

    </div>
  );
};

export default BestSeller;
