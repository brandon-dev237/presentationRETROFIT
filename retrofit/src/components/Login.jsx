// ============================================================
// COMPOSANT POPUP DE CONNEXION / INSCRIPTION
// Ce composant est une fenêtre modale (popup) qui apparaît
// quand l'utilisateur clique sur "Se connecter".
// Il permet de se connecter à un compte existant OU d'en créer un.
// Cliquer en dehors de la fenêtre la ferme automatiquement.
// ============================================================

import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast'; // Pour les notifications

const Login = () => {

    // On récupère les fonctions nécessaires depuis le contexte
    const { setShowUserLogin, setUser, axios } = useAppContext()

    // state = "login" pour se connecter, "register" pour créer un compte
    const [state, setState] = React.useState("login");

    // Champs du formulaire
    const [name, setName] = React.useState("");        // Prénom (inscription seulement)
    const [email, setEmail] = React.useState("");      // Email
    const [password, setPassword] = React.useState(""); // Mot de passe

    // Cette fonction est appelée quand on soumet le formulaire
    const onSubmitHandler = async (event) => {
        try {
            // On empêche le rechargement de la page (comportement par défaut des formulaires)
            event.preventDefault();

            // On choisit la bonne URL selon le mode : connexion ou inscription
            const url = state === "login" ? "/api/user/login" : "/api/user/register";

            // On prépare les données à envoyer
            // En connexion : email + mot de passe
            // En inscription : nom + email + mot de passe
            const payload = state === "login" ? { email, password } : { name, email, password };

            // On envoie les données au serveur
            const { data } = await axios.post(url, payload);

            if (data.success) {
                // Succès ! On sauvegarde l'utilisateur dans le contexte
                setUser(data.user);
                // On ferme le popup de connexion
                setShowUserLogin(false);
            } else {
                // Échec → on affiche le message d'erreur du serveur
                toast.error(data.message);
            }
        } catch (error) {
            // Erreur réseau ou autre → on affiche l'erreur
            toast.error(error.message);
        }
    }



  return (
    // Le fond sombre derrière le popup — cliquer dessus ferme le popup
    <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50 animate-fadeIn'>

       {/* Le formulaire — e.stopPropagation() empêche la fermeture quand on clique DANS le formulaire */}
       <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-6 sm:p-8 py-10 sm:py-12 w-[90vw] sm:w-[352px] max-w-sm text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">

            {/* Titre du popup */}
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">Mon compte</span> {state === "login" ? "Login" : "Sign Up"}
            </p>

            {/* Champ Nom — visible seulement en mode inscription */}
            {state === "register" && (
                <div className="w-full">
                    <p>Nom</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="entrez votre nom" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}

            {/* Champ Email */}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="entrez votre email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>

            {/* Champ Mot de passe */}
            <div className="w-full ">
                <p>Mots de passe </p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="votre mots de passe" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>

            {/* Lien pour basculer entre connexion et inscription */}
            {state === "register" ? (
                <p>
                    vous avez deja un compte? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">cliquez ici </span>
                </p>
            ) : (
                <p>
                    Creer un compte? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">cliquez ici </span>
                </p>
            )}

            {/* Bouton de soumission — le texte change selon le mode */}
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
