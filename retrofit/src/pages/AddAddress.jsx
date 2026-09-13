// ============================================================
// PAGE AJOUTER UNE ADRESSE DE LIVRAISON
// Cette page permet à l'utilisateur d'enregistrer une adresse
// de livraison pour ses commandes. Elle contient un formulaire
// avec tous les champs nécessaires (nom, rue, ville, pays...).
// ============================================================

import React from 'react'
import assets from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// Composant réutilisable pour un champ de formulaire
// Il reçoit : type (text/email/number), placeholder (texte d'aide),
// name (correspond au champ dans l'objet address), handleChange (fonction de mise à jour),
// et address (l'objet contenant toutes les valeurs actuelles du formulaire)
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name] ?? ""}
        required
    />
)


const AddAddress = () => {

    const {axios , user , navigate} = useAppContext()

    // L'objet "address" contient tous les champs du formulaire
    // Chaque propriété correspond à un champ de saisie
    const [address, setAddress] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    })

    // handleChange est appelé à chaque frappe dans n'importe quel champ
    // Il met à jour seulement le champ modifié dans l'objet address
    // grâce à la notation [name] qui utilise le nom du champ comme clé dynamique
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress, // On copie tous les champs existants
            [name]: value,  // On écrase seulement le champ modifié
        }))
    }

    // Appelé à la soumission du formulaire
    // TODO: envoyer l'adresse au serveur via axios.post('/api/address/add', address)
    const onSubmitHandler = async () => {
        console.log('onSubmitHandler appelé', address);
        try {
            const { data } = await axios.post('/api/address/add', { address });
            console.log('réponse serveur:', data);
            if (data.success) {
                toast.success(data.message);
                navigate('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('erreur:', error);
            toast.error(error.message);
        }
    }

  return (
    <div className='mt-16 pb-16'>
        <p className='text-2xl md:text-3xl text-gray-500'  > Adresse de livraison.  <span className='font-semibold text-primary'   >Addresse</span> </p>

      <div className='flex flex-col-reverse md:flex-row justify-between mt-10' >
       <div className='flex-1 max-w-md' >
          <form onSubmit={(e) => e.preventDefault()} className='space-y-3 mt-6 text-sm'>

            <div className='grid grid-cols-2 gap-4' >
                <InputField handleChange={handleChange} address={address}
                name='firstName' type='text' placeholder='Prenom' />

                <InputField handleChange={handleChange} address={address}
                name='lastName' type='text' placeholder='Nom de famille' />
            </div>

                    <InputField handleChange={handleChange} address={address}
                    name='email' type='email' placeholder='Adresse email' />

                    <InputField handleChange={handleChange} address={address}
                    name='street' type='text' placeholder='Rue' />

                <div className='grid grid-cols-2 gap-4' >

                    <InputField handleChange={handleChange} address={address}
                    name='city' type='text' placeholder='ville' />
                    <InputField handleChange={handleChange} address={address}
                    name='state' type='text' placeholder='État/Province' />
                   
                </div>

                
                <div className='grid grid-cols-2 gap-4' >

                    <InputField handleChange={handleChange} address={address}
                    name='zipcode' type='number' placeholder='Code postal' />
                    <InputField handleChange={handleChange} address={address}
                    name='country' type='text' placeholder='Pays' />
                   
                </div>

                
                    <InputField handleChange={handleChange} address={address}
                    name='phone' type='text' placeholder='Numéro de téléphone' />
                   
                <button type="button" onClick={onSubmitHandler} className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase' >
                    enregistre l'adresse
                </button>

          </form>
       </div>
       <img className='md:mr-16 mb-16 md:mt-0 w-full md:w-80 lg:w-96 object-contain' src={assets.add_address_iamge} />

      </div>


    </div>
  )
}

export default AddAddress
