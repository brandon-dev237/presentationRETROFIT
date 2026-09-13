// ============================================================
// BARRE DE NAVIGATION
// Ce composant est la barre du haut visible sur toutes les pages.
// Elle contient le logo, les liens vers les pages, la recherche,
// l'icône panier et les boutons de connexion/déconnexion.
// ============================================================

import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'; // NavLink = lien de navigation
import assets from '../assets/assets'; // Images et icônes
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


const Navbar = () => {
     // État local : est-ce que le menu mobile est ouvert ?
     const [open, setOpen] = React.useState(false)

     // On récupère les données nécessaires depuis le contexte global
     const {user,setUser,setShowUserLogin,navigate,setSearchQuery,searchQuery,getCartCount,axios} = useAppContext();

     // Fonction de déconnexion : on efface l'utilisateur et on va à l'accueil
     const logout = async ()=>{

         try {
            const{data} = await axios.post ('/api/user/logout')
            if(data.success){
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
         } catch (error) {
            toast.error(error.message)
         }

        // On déconnecte localement dans tous les cas, même si l'appel serveur échoue
        setUser(null);   // On supprime l'utilisateur du contexte
        navigate('/')    // On redirige vers la page d'accueil
     }


    // Quand l'utilisateur tape dans la recherche, on le redirige automatiquement
    // vers la page "tous les produits" pour voir les résultats
    useEffect(()=>{
      if(searchQuery.length > 0){
        navigate("/products") // Redirection automatique si texte saisi
      }
    },[searchQuery]) // Se déclenche chaque fois que searchQuery change

  return (
  <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 z-20 transition-all">

            {/* Logo cliquable — ferme le menu mobile et va à l'accueil */}
            <NavLink to='/' onClick={()=> setOpen(false)}>
                <img className='h-9' src={assets.logo} alt="logopage" />
            </NavLink>

            {/* Menu de navigation — visible seulement sur les grands écrans (hidden sm:flex) */}
            <div className="hidden sm:flex items-center gap-8">
                {/* Liens de navigation principaux */}
                <NavLink to='/'>Accueil</NavLink>
                <NavLink to='/products'>Nos Articles </NavLink>
                <NavLink to='/'>Contact</NavLink>
                {/* Lien vers l'espace vendeur (page de connexion ou dashboard selon l'état) */}
                <NavLink to='/seller'>Espace vendeur</NavLink>

                {/* Barre de recherche — visible seulement sur les très grands écrans */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    {/* onChange met à jour searchQuery dans le contexte à chaque frappe */}
                    <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="rechercher des produits" />
                   <img src={assets.seahrc} alt='search' className='w-4 h-4' />
                </div>

                {/* Icône panier avec badge de quantité */}
                <div onClick={()=> navigate('/cart')} className="relative cursor-pointer">
                   <img src={assets.nav_cart_icon} alt="icone_cart" className='w-6 h-6 opacity-80' />
                    {/* Le badge rouge avec la quantité n'apparaît que si le panier n'est pas vide */}
                    {getCartCount() > 0 && <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>}
                </div>

               {/* Si personne n'est connecté → bouton "Se connecter" */}
               {!user ?(  <button onClick={()=> setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    connecter
                </button>)
                :(
                    // Si l'utilisateur est connecté → menu déroulant avec ses options
                    <div className='relative group'>
                        {/* Photo de profil — au survol, le menu apparaît */}
                        <img src={assets.profile_icon} className='w-7 h-7' alt=" profil" />
                        {/* Menu déroulant caché par défaut, visible au survol (group-hover) */}
                        <ul className='absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                            {/* Lien vers la page des commandes */}
                            <li onClick={()=> navigate ('/my-orders')} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' >Mes Commandes </li>
                            {/* Bouton de déconnexion */}
                            <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Deconnecter</li>
                        </ul>
                    </div>
                )}
            </div>

             {/* Partie droite sur mobile : panier + bouton menu hamburger */}
             <div className='flex items-center gab-6 sm:hidden'>
                    {/* Icône panier mobile */}
                    <div onClick={()=> navigate('/cart')} className="relative cursor-pointer">
                   <img src={assets.nav_cart_icon} alt="icone_cart" className='w-6 h-6 opacity-80' />
                    {getCartCount() > 0 && <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>}
                     </div>
                     {/* Bouton hamburger : ouvre/ferme le menu mobile */}
                     <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                 {/* Icône menu hamburger */}
                    <img src={assets.menu} alt="menu_icon" className='w-6 h-6'/>
                  </button>
                </div>

            {/* Menu mobile — s'affiche seulement quand open === true */}
         {   open && (
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-30`}>
                {/* Liens de navigation mobile — chaque clic ferme aussi le menu */}
                <NavLink to="/" onClick={()=> setOpen(false)} >Accueil</NavLink>
                <NavLink to="/products" onClick={()=> setOpen(false)} >Nos Produits </NavLink>
                {/* Lien "Mes Commandes" visible seulement si connecté */}
                {user &&
                <NavLink to="/my-orders" onClick={()=> setOpen(false)} >Mes Commandes </NavLink>
                  }
                <NavLink to="/products" onClick={()=> setOpen(false)} >Contacter </NavLink>
                {/* Lien vers l'espace vendeur, aussi disponible dans le menu mobile */}
                <NavLink to="/seller" onClick={()=> setOpen(false)} >Espace vendeur</NavLink>

                {/* Bouton connexion ou déconnexion selon l'état */}
                {!user ? (
                 <button onClick={()=>{
                    setOpen(false);           // On ferme le menu
                    setShowUserLogin(true);   // On ouvre le popup de connexion
                 }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    connecter
                </button>
                ) : (
                     <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Deconnecter
                </button>
                )}

            </div>)}

        </nav>
  )
}

export default Navbar;
