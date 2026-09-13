// ============================================================
// PAGE POLITIQUE DE CONFIDENTIALITÉ
// Explique quelles données personnelles sont collectées, pourquoi,
// combien de temps elles sont conservées, et quels sont les droits
// des utilisateurs (RGPD). Reflète les données réellement traitées
// par l'application : compte, panier, adresses, commandes, paiement.
// Les valeurs entre crochets [ ] sont des exemples à personnaliser.
// ============================================================

const PrivacyPolicy = () => {
    return (
        <div className='mt-16 pb-16 max-w-3xl text-sm text-gray-600 leading-relaxed'>
            <p className='text-2xl md:text-3xl text-gray-500 mb-8'>
                Politique de <span className='font-semibold text-primary'>confidentialité</span>
            </p>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Responsable du traitement</h2>
                <p>
                    Les données personnelles collectées sur le site RetroFit sont traitées par
                    <strong> [Raison sociale / Nom de l'entreprise]</strong>, joignable à
                    l'adresse [email de contact]. Cette politique s'applique conformément au
                    Règlement Général sur la Protection des Données (RGPD).
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Données que nous collectons</h2>
                <ul className='list-disc pl-5 space-y-1'>
                    <li>Compte : nom, adresse email, mot de passe (stocké chiffré, jamais en clair)</li>
                    <li>Panier : produits et quantités sélectionnés</li>
                    <li>Adresses de livraison : nom, prénom, email, rue, ville, région, code postal, pays, téléphone</li>
                    <li>Commandes : articles achetés, montant, mode de paiement, statut de livraison</li>
                    <li>Paiement en ligne : traité directement par Stripe — RetroFit ne stocke jamais vos coordonnées bancaires</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Pourquoi nous les utilisons</h2>
                <p>Ces données sont utilisées pour :</p>
                <ul className='list-disc pl-5 space-y-1 mt-2'>
                    <li>créer et sécuriser votre compte client ;</li>
                    <li>traiter et livrer vos commandes ;</li>
                    <li>vous permettre de suivre l'historique de vos achats ;</li>
                    <li>assurer le paiement en ligne via notre prestataire Stripe ;</li>
                    <li>répondre à nos obligations légales et comptables.</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Cookies et stockage local</h2>
                <p>
                    Un cookie technique et strictement nécessaire (<code>token</code> ou{' '}
                    <code>sellerToken</code>) est déposé lors de la connexion afin de vous maintenir
                    identifié pendant 7 jours. Ce cookie ne sert à aucun suivi publicitaire.
                </p>
                <p className='mt-2'>
                    Le contenu de votre panier est également conservé localement dans votre navigateur
                    (stockage local) afin de le retrouver d'une visite à l'autre.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Durée de conservation</h2>
                <p>
                    Les données de compte sont conservées tant que le compte est actif. Les données de
                    commande sont conservées [durée, ex : 5 ans] conformément aux obligations comptables
                    et fiscales. Vous pouvez demander la suppression de votre compte à tout moment.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Partage des données</h2>
                <p>
                    Vos données ne sont jamais vendues. Elles peuvent être transmises à nos prestataires
                    techniques strictement nécessaires au fonctionnement du service : Stripe (paiement),
                    MongoDB Atlas (hébergement de la base de données) et Cloudinary (hébergement des
                    images produits, qui ne reçoit pas vos données personnelles).
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Vos droits</h2>
                <p>
                    Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement,
                    de limitation, d'opposition et de portabilité de vos données. Pour exercer ces droits,
                    contactez-nous à [email de contact]. Vous pouvez également introduire une réclamation
                    auprès de la CNIL (www.cnil.fr).
                </p>
            </section>

            <section>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Sécurité</h2>
                <p>
                    Les mots de passe sont chiffrés (bcrypt) et ne sont jamais stockés en clair. Les
                    échanges avec le serveur sont sécurisés et l'accès à vos données personnelles est
                    limité aux personnes habilitées.
                </p>
            </section>
        </div>
    )
}

export default PrivacyPolicy
