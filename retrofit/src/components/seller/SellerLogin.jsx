// ============================================================
// PAGE DE CONNEXION VENDEUR
// Cette page s'affiche quand quelqu'un essaie d'accéder à /seller
// sans être connecté comme vendeur. Elle permet au seul vendeur
// autorisé de se connecter avec son email et mot de passe.
// ============================================================

import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
    // On récupère les données et fonctions nécessaires du contexte
    const {isSeller, setIsSeller, navigate, axios} = useAppContext()

    // Champs du formulaire de connexion
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // Cette fonction est appelée quand le vendeur soumet le formulaire
    const onSubmitHandler = async (event)=> {
        try {
            // On empêche le rechargement de la page
            event.preventDefault();

            // On envoie l'email et le mot de passe au serveur
            const {data} = await axios.post('/api/seller/login',{email, password})

            if(data.success){
                // Connexion réussie ! On marque l'utilisateur comme vendeur dans le contexte
                setIsSeller(true)
                // On redirige vers le tableau de bord vendeur
                navigate('/seller')
            }else{
                // Identifiants incorrects → on affiche le message d'erreur
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }

    // Si le vendeur est déjà connecté, on le redirige automatiquement vers le dashboard
    // useEffect se déclenche chaque fois que isSeller change
     useEffect(()=>{
        if(isSeller){
            navigate("/seller")
        }
     },[isSeller])

    // Si le vendeur est déjà connecté, on ne rend rien (la redirection gère ça)
    if (isSeller) return null;

    // Formulaire de connexion vendeur
    return (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600' >

        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>

            {/* Titre du formulaire */}
            <p className='text-2xl font-medium m-auto' > <span className='text-primary' >Vendeur</span> connexion </p>

            {/* Champ Email */}
            <div className='w-full'>
                <p>Email</p>
                {/* onChange met à jour le state email à chaque frappe */}
                <input onChange={(e)=> setEmail(e.target.value)} value={email}
                type="email" placeholder='entrez votre email'
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />

            </div>

            {/* Champ Mot de passe */}
             <div className='w-full'>
                <p>Mots de passe</p>
                <input onChange={(e)=> setPassword(e.target.value)} value={password}
                type="password" placeholder='entrez votre mot de passe'
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />

            </div>

            {/* Bouton de connexion — soumet le formulaire */}
            <button className='bg-primary text-white w-full py-2 rounded-md'>
                se connecter
            </button>

        </div>

    </form>
  )
}

export default SellerLogin
