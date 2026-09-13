// ============================================================
// PAGE MENTIONS LÉGALES
// RetroFit est un projet de démonstration (portfolio/étudiant), pas une
// société immatriculée : il n'y a donc pas de SIRET, RCS ni numéro de TVA
// à afficher. Si le projet devient un jour une vraie activité commerciale,
// il faudra remplacer la section "Éditeur du site" par les informations
// réelles de l'entreprise (raison sociale, SIRET, siège social, etc.).
// ============================================================

const LegalNotice = () => {
    return (
        <div className='mt-16 pb-16 max-w-3xl text-sm text-gray-600 leading-relaxed'>
            <p className='text-2xl md:text-3xl text-gray-500 mb-8'>
                Mentions <span className='font-semibold text-primary'>légales</span>
            </p>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Éditeur du site</h2>
                <p>
                    Le site est édité par <strong>RetroFit</strong>.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Hébergement</h2>
                <p>
                    Le site est hébergé par <strong>Railway Corporation</strong>, 251 Little Falls Drive,
                    Wilmington, Delaware 19808, États-Unis.
                </p>
                <p className='mt-2'>
                    La base de données est hébergée par MongoDB Atlas (MongoDB, Inc.).
                    Les images des produits sont hébergées par Cloudinary Ltd.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Propriété intellectuelle</h2>
                <p>
                    L'ensemble des éléments présents sur le site RetroFit (textes, images, logos, charte
                    graphique, structure du site) est protégé par le droit d'auteur et le droit des marques.
                    Toute reproduction, représentation ou exploitation, totale ou partielle, sans
                    autorisation préalable écrite, est interdite et constitue une contrefaçon.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Limitation de responsabilité</h2>
                <p>
                    RetroFit met tout en œuvre pour assurer l'exactitude des informations diffusées sur le
                    site, mais ne peut garantir l'absence totale d'erreurs. RetroFit ne saurait être tenu
                    responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation
                    du site, y compris l'inaccessibilité, les pertes de données ou la présence de virus.
                </p>
            </section>

            <section>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Médiation et litiges</h2>
                <p>
                    RetroFit étant un site de démonstration, les paiements effectués via Stripe sont
                    réalisés en mode test : aucune vente réelle n'a lieu et aucune somme n'est débitée.
                    Les dispositions du Code de la consommation relatives à la médiation ne s'appliquent
                    donc pas en l'état.
                </p>
            </section>
        </div>
    )
}

export default LegalNotice
