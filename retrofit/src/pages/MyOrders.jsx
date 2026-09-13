// ============================================================
// PAGE MES COMMANDES
// Cette page affiche toutes les commandes passées par l'utilisateur connecté.
// Chaque commande montre les articles achetés, le statut, la date et le montant.
// ============================================================

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {

    // Liste des commandes de l'utilisateur
    const [myOrders, setMyOrders] = useState([])

    // On récupère la monnaie, axios (pour les requêtes) et l'utilisateur depuis le contexte
    const { currency, axios, user } = useAppContext()

    // Cette fonction charge les commandes depuis le serveur
    const fetchmyorders = async () => {
        try {
            // On demande au serveur la liste des commandes de l'utilisateur connecté
            // Le serveur identifie l'utilisateur grâce au cookie dans la requête
            const { data } = await axios.get('/api/order/user');
            if (data.success) {
                // Si ça marche, on sauvegarde les commandes
                setMyOrders(data.orders);
            }
        } catch (error) {
            // En cas d'erreur, on l'affiche dans la console
            console.log(error.message);
        }
    }

    // On charge les commandes seulement si l'utilisateur est connecté
    // useEffect se déclenche quand "user" change (connexion/déconnexion)
    useEffect(() => {
        if (user) fetchmyorders(); // Si connecté → on charge les commandes
    }, [user])


  return (
    <div className='mt-16 pb-16' >

          {/* Titre de la page */}
          <div className='flex flex-col items-end w-max mb-8'>
               <p className='text-2xl font-medium uppercase' >Mes commandes</p>
               <div className='w-16 h-0.5 bg-primary rounded-full' ></div>
          </div>

          {/* Message si l'utilisateur n'est pas connecté */}
          {!user && <p className='text-gray-500'>Connectez-vous pour voir vos commandes.</p>}

          {/* Message si l'utilisateur est connecté mais n'a pas encore commandé */}
          {user && myOrders.length === 0 && <p className='text-gray-500'>Aucune commande pour le moment.</p>}

          {/* On affiche chaque commande — chaque commande est dans une boîte */}
          {myOrders.map((order, index) => (
            <div key={index} className='border border-gray-300 rounded-lg bg-white text-gray-500/70 mb-4 w-full max-w-4xl overflow-hidden'>

              {/* On affiche chaque article dans la commande */}
              {order.items.map((item, itemIndex) => (

                <div key={itemIndex} className={`grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-3 sm:gap-6 p-4 ${itemIndex !== 0 ? 'border-t border-gray-200' : ''}`}>

                  {/* Colonne 1 : Numéro de commande + Image + Nom + Catégorie */}
                  <div className='flex flex-col gap-2'>
                    {/* Le numéro de commande s'affiche seulement pour le premier article */}
                    {itemIndex === 0 && (
                      <p className='text-xs text-gray-400 font-medium'>
                        N° commande : <span className='text-gray-600'>{order._id}</span>
                      </p>
                    )}
                    <div className='flex items-center gap-3'>
                      {/* Image du produit commandé */}
                      <div className='bg-primary/10 p-2 rounded-lg w-16 h-16 flex items-center justify-center shrink-0'>
                        <img src={item.product.image[0]} alt={item.product.name} className='w-12 h-12 object-contain' />
                      </div>
                      {/* Nom et catégorie du produit */}
                      <div>
                        <h2 className='text-sm font-medium text-gray-800'>{item.product.name}</h2>
                        <p className='text-xs'>{item.product.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Colonne 2 : Mode de paiement + Quantité + Statut + Date */}
                  <div className='flex flex-col gap-1 text-sm'>
                    {/* Le mode de paiement s'affiche seulement pour le premier article */}
                    {itemIndex === 0 && (
                      <p className='text-xs text-gray-400 font-medium'>
                        Paiement : <span className='text-gray-600'>{order.paymentType}</span>
                      </p>
                    )}
                    <p>Quantité : {item.quantity || '1'}</p>
                    {/* Le statut est coloré en vert (couleur primaire) */}
                    <p>Statut : <span className='text-primary font-medium'>{order.status}</span></p>
                    {/* La date est formatée en français avec toLocaleDateString() */}
                    <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  {/* Colonne 3 : Total de la commande */}
                  <div className='flex flex-col items-start sm:items-end gap-1'>
                    {/* Le total global s'affiche seulement pour le premier article */}
                    {itemIndex === 0 && (
                      <p className='text-xs text-gray-400 font-medium'>
                        Total : <span className='text-primary font-semibold'>{currency}{order.amount}</span>
                      </p>
                    )}
                    {/* Prix de cet article : prix × quantité */}
                    <p className='text-sm text-primary font-medium'>
                      {currency}{item.product.offerPrice * item.quantity}
                    </p>
                  </div>

                </div>

              ))}

            </div>
          ))}

    </div>
  )
}

export default MyOrders
