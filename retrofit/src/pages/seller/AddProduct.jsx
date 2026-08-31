// ============================================================
// PAGE AJOUTER UN PRODUIT (ESPACE VENDEUR)
// Cette page permet au vendeur d'ajouter un nouveau produit
// dans la boutique. Il peut choisir jusqu'à 4 photos, donner
// un nom, une description, une catégorie et un prix.
// ============================================================

import React, { useState } from 'react'
import { categories } from '../../assets/assets' // Liste des catégories disponibles
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddProduct = () => {

// ---- ÉTATS DU FORMULAIRE ----
// Chaque variable stocke la valeur d'un champ du formulaire

// Tableau des images sélectionnées (jusqu'à 4 images)
const [files, setFiles] = useState([]);

// Clé qui change à chaque soumission pour forcer le rechargement des inputs
// (permet de vider les inputs fichiers après soumission réussie)
const [inputKey, setInputKey] = useState(0);

const [name, setName] = useState('');           // Nom du produit
const [description, setDescription] = useState(''); // Description
const [category, setCategory] = useState('');   // Catégorie choisie
const [price, setPrice] = useState('');         // Prix normal
const [offerPrice, setOfferPrice] = useState(''); // Prix réduit

// On récupère axios et fetchProducts depuis le contexte
const {axios, fetchProducts} = useAppContext()


// ---- SOUMISSION DU FORMULAIRE ----
// Cette fonction est appelée quand le vendeur clique sur "Ajouter"
const onSubmitHandler = async (event) => {
    try {
        // On empêche le rechargement de la page
        event.preventDefault();

        // On prépare les données du produit
        const productData = {
            name,
            description,
            category,
            price,
            offerPrice
        }

        // FormData permet d'envoyer des fichiers et des textes ensemble
        const formData = new FormData();

        // On ajoute les données du produit en JSON (texte)
        formData.append('productData', JSON.stringify(productData));

        // On ajoute chaque image sélectionnée
        // filter(Boolean) enlève les cases vides (si l'utilisateur n'a pas rempli toutes les cases)
        files.filter(Boolean).forEach(f => formData.append('images', f));

        // On envoie tout au serveur
        const {data} = await axios.post('/api/product/add',formData)

        if(data.success){
            // Produit ajouté avec succès !
            toast.success(data.message);

            // On recharge la liste des produits pour inclure le nouveau
            await fetchProducts();

            // On vide tous les champs du formulaire
            setName('');
            setDescription('');
            setCategory('');
            setPrice('');
            setOfferPrice('');
            setFiles([]);

            // On change la clé pour forcer le rechargement des inputs fichier
            // (sans ça, les miniatures des images restent affichées)
            setInputKey(k => k + 1);
        }else{
            // Erreur → on affiche le message du serveur
            toast.error(data.message)
        }


    } catch (error) {
             toast.error(error.message)
    }

  // soumettre les données du produit à l'API ou effectuer d'autres actions nécessaires
};

  return (

        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form  onSubmit={onSubmitHandler}  className="md:p-10 p-4 space-y-5 max-w-lg">

                {/* ---- ZONE DE SÉLECTION DES IMAGES ---- */}
                <div>
                    <p className="text-base font-medium">image du produit</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {/* On crée 4 cases pour les images (index 0, 1, 2, 3) */}
                        {Array(4).fill('').map((_, index) => (
                            // La clé change avec inputKey pour forcer le remontage après soumission
                            <label key={`${inputKey}-${index}`} htmlFor={`image${inputKey}-${index}`}>

                                {/* Input fichier caché — le label le déclenche au clic */}
                                <input onChange={(e)=>{
                                   // Quand l'utilisateur choisit une image, on la sauvegarde dans le tableau
                                   const updatedFiles = [...files];
                                   updatedFiles [index] = e.target.files [0] // On stocke le fichier à sa position
                                    setFiles(updatedFiles)

                                }}
                                accept="image/*" type="file" id={`image${inputKey}-${index}`} hidden />


                                {/* Si une image est sélectionnée → on affiche sa miniature */}
                                {files[index] ? (
                                    <img className="max-w-24 cursor-pointer object-cover w-24 h-24 rounded" src={URL.createObjectURL(files[index])} alt="uploadArea" />
                                ) : (
                                    // Sinon → on affiche une zone de clic avec une icône d'upload
                                    <div className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span className="text-xs text-gray-400 mt-1">Upload</span>
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* ---- CHAMP NOM DU PRODUIT ---- */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Nom du Produit</label>
                    {/* onChange met à jour le state name à chaque frappe */}
                    <input onChange={(e)=> setName(e.target.value)} value={name}
                    id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                {/* ---- CHAMP DESCRIPTION ---- */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    {/* textarea = zone de texte multiligne pour la description */}
                    <textarea onChange={(e)=> setDescription(e.target.value)} value={description}
                     id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>

                {/* ---- SÉLECTEUR DE CATÉGORIE ---- */}
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select
                       onChange={(e)=> setCategory (e.target.value)} value={category}
                    id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Categorie</option>
                        {/* On génère une option pour chaque catégorie disponible */}
                      {categories.map((item, index)=>(
                          <option key={index} value={item.path}>{item.text}</option>
                      ))}
                    </select>
                </div>

                {/* ---- CHAMPS PRIX ---- */}
                <div className="flex items-center gap-5 flex-wrap">
                    {/* Prix normal */}
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e)=> setPrice(e.target.value)} value={price}
                        id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    {/* Prix avec réduction */}
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price"> prix d'offre </label>
                        <input onChange={(e)=> setOfferPrice(e.target.value)} value={offerPrice}
                        id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>

                {/* ---- BOUTON DE SOUMISSION ---- */}
                <button className="px-8 py-2.5 bg-primary text-white cursor-pointer font-medium rounded  ">Ajouter </button>
            </form>
        </div>

  )
}

export default AddProduct
