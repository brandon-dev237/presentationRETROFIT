// ============================================================
// COMPOSANT NEWSLETTER
// Ce composant affiche un formulaire d'abonnement en bas de
// la page d'accueil. Les visiteurs entrent leur email pour
// recevoir les nouveautés et offres de la boutique.
// TODO: connecter la soumission du formulaire à un service d'emailing.
// ============================================================

const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-3 mt-12 sm:mt-16 md:mt-24 pb-14 px-4">
            {/* Titre accrocheur */}
            <h1 className="text-[clamp(1.2rem,4vw,2.5rem)] font-semibold">
                Ne ratez aucune pépite vintage!
            </h1>
            {/* Description de l'abonnement */}
            <p className="text-sm sm:text-base md:text-lg text-gray-500/70 pb-4 md:pb-8 max-w-xl">
                Abonnez-vous pour ne rien manquer : offres, nouveautés et promotions exclusives.
            </p>
            {/* Formulaire email + bouton sur la même ligne */}
            <form className="flex items-center justify-between max-w-2xl w-full h-11 sm:h-12 md:h-13">
                {/* Champ email — le bord droit est supprimé pour fusionner visuellement avec le bouton */}
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-sm sm:text-base text-gray-500"
                    type="email"
                    placeholder="Entrez votre e-mail"
                    required
                />
                {/* Bouton de soumission — collé au champ email grâce à rounded-l-none */}
                <button
                    type="submit"
                    className="px-4 sm:px-8 md:px-12 h-full text-sm sm:text-base text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none whitespace-nowrap"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    )
}

export default NewsLetter
