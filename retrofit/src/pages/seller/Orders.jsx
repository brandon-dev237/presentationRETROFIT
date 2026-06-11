// ============================================================
// PAGE COMMANDES (ESPACE VENDEUR)
// Cette page affiche toutes les commandes passées par les clients.
// Le vendeur peut voir qui a commandé quoi, où livrer,
// le montant, le mode de paiement et la date.
// ============================================================

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import assets, { dummyOrders } from '../../assets/assets' // Icône et commandes de démonstration

const Orders = () => {
     // On récupère le symbole monétaire depuis le contexte
     const {currency} = useAppContext()

     // Liste des commandes à afficher
     const [orders, setOrders] = useState([])

    // Cette fonction charge les commandes
    // Pour l'instant elle utilise les commandes de démonstration (dummyOrders)
    // À terme, elle devrait appeler le serveur : axios.get('/api/order/seller')
    const  fetchOrders= async () =>{
           setOrders (dummyOrders) // On utilise les données de démonstration
    };

    // On charge les commandes au chargement de la page
    useEffect (()=>{
          fetchOrders();
    },[]) // [] = s'exécute une seule fois au montage du composant



  return (
    <div className='no-srollbar flex-1 h-[95vh] overflow-y-scroll'  >
         <div className="md:p-10 p-4 space-y-4">
            {/* Titre de la page */}
            <h2 className="text-lg font-medium">liste de commande </h2>

            {/* On affiche chaque commande dans une carte */}
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col  md:items-center md:flex-row gap-5 justify-between  p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">

                    {/* ---- SECTION 1 : Articles commandés ---- */}
                    <div className="flex gap-5 max-w-80">
                        {/* Icône de commande */}
                        <img className="w-8 h-8 object-contain" src={assets.order_icon} alt="orderIcon" />
                        <div>
                            {/* On liste tous les articles de la commande */}
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <p className="font-medium">
                                        {/* Nom du produit + quantité en couleur primaire */}
                                        {item.product.name}{""}
                                        <span className='text-primary'>x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---- SECTION 2 : Adresse de livraison ---- */}
                    <div className="text-sm md:text-base text-black/60">
                        {/* Nom complet du destinataire */}
                        <p className='font-medium mb-1'>{order.address.firstName} {order.address.lastName}</p>

                        {/* Rue et ville */}
                        <p>{order.address.street}, {order.address.city}</p>

                        {/* Région, code postal et pays */}
                        <p> {order.address.state}, {order.address.zipcode} , {order.address.country}</p>
                        <p></p>
                        {/* Numéro de téléphone */}
                        <p>{order.address.phone}</p>
                    </div>

                    {/* ---- SECTION 3 : Montant total ---- */}
                    <p className="font-medium text-lg my-auto ">
                    {currency}{order.amount}</p>

                    {/* ---- SECTION 4 : Informations de paiement ---- */}
                    <div className="flex flex-col text-sm md:text-base text-black/60">
                        {/* Mode de paiement (COD ou Online) */}
                        <p>Method: {order.paymentType}</p>
                        {/* Date de la commande — toLocaleDateString() formate en date lisible */}
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        {/* Statut du paiement */}
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
     </div>
  )
}

export default Orders
