// ============================================================
// PAGE MENTIONS LÉGALES
// Informations obligatoires sur l'éditeur du site, l'hébergement
// et la propriété intellectuelle (article 6-III de la LCEN).
// Les valeurs entre crochets [ ] sont des exemples à remplacer
// par les vraies informations de l'entreprise avant mise en ligne.
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
                    Le site RetroFit est édité par <strong>[Raison sociale / Nom de l'entreprise]</strong>,
                    [forme juridique, ex : SASU au capital de X €], immatriculée au Registre du Commerce
                    et des Sociétés de [ville] sous le numéro SIRET [XXX XXX XXX XXXXX].
                </p>
                <p className='mt-2'>
                    Siège social : [adresse complète]<br />
                    Numéro de TVA intracommunautaire : [FRXX XXXXXXXXX]<br />
                    Directeur de la publication : [Nom et prénom]<br />
                    Contact : [email de contact] — [numéro de téléphone]
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-lg font-medium text-gray-800 mb-2'>Hébergement</h2>
                <p>
                    Le site est hébergé par <strong>[nom de l'hébergeur, ex : Vercel Inc. / OVH SAS]</strong>,
                    [adresse de l'hébergeur].
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
                    Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, en cas de
                    litige non résolu directement avec RetroFit, le client peut recourir gratuitement au
                    service de médiation [nom du médiateur de la consommation].
                </p>
            </section>
        </div>
    )
}

export default LegalNotice
