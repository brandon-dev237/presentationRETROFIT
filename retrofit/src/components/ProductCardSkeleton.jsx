// ============================================================
// SQUELETTE DE CARTE PRODUIT
// Placeholder animé affiché à la place d'une ProductCard pendant
// le chargement des produits, pour éviter un passage brutal d'une
// grille vide à une grille remplie.
// ============================================================

const ProductCardSkeleton = () => (
    <div className="border border-gray-500/20 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 bg-white w-full animate-pulse">
        <div className="w-full h-24 sm:h-32 md:h-40 bg-gray-200 rounded" />
        <div className="mt-1 sm:mt-2 space-y-1.5">
            <div className="h-2.5 w-1/3 bg-gray-200 rounded" />
            <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
            <div className="h-5 w-1/2 bg-gray-200 rounded mt-2" />
        </div>
    </div>
)

export default ProductCardSkeleton
