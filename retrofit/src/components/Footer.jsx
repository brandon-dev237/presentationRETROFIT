// ============================================================
// PIED DE PAGE (FOOTER)
// Ce composant affiche la section du bas de toutes les pages.
// Il contient le logo avec une description de la boutique,
// ainsi que des liens organisés en colonnes (Boutique, Aide, etc.).
// Les liens sont définis dans le tableau "footerLinks" dans assets.js.
// ============================================================

import { Link } from "react-router-dom";
import assets, { footerLinks } from "../assets/assets"; // Logo et liens du footer

const Footer = () => {
  return (
    // Fond légèrement coloré pour distinguer le footer du reste de la page
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-12 sm:mt-16 md:mt-24 bg-primary/10">

      {/* Section principale du footer : logo + colonnes de liens */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10 py-6 md:py-10 border-b border-gray-500/30 text-gray-500">

        {/* Colonne gauche : Logo et description de la boutique */}
        <div className="w-full md:w-auto">
          <img className="w-24 sm:w-28 md:w-36" src={assets.logo} alt="logo" />
          <p className="text-xs sm:text-sm max-w-full md:max-w-[410px] mt-3 md:mt-6 leading-relaxed">
            Chez RetroFit, chaque vêtement a une histoire. Trouvez des pièces vintage uniques, économisez tout en faisant un geste pour la planète. La mode durable commence ici.
          </p>
        </div>

        {/* Colonnes de liens — générées depuis footerLinks dans assets.js */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-4 md:gap-5">
          {footerLinks.map((section, index) => (
            <div key={index} className="min-w-[28%] sm:min-w-0">
              {/* Titre de la colonne (ex: "Boutique", "Aide") */}
              <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-2 md:mb-5">
                {section.title}
              </h3>
              {/* Liste des liens dans cette colonne */}
              <ul className="text-xs sm:text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="hover:underline transition duration-200">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Barre du bas : liens légaux + copyright */}
      <div className="py-3 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-center text-xs sm:text-sm md:text-base text-gray-500/80">
        <p>Copyright © 2026 RetroFit — Mode vintage durable</p>
        <div className="flex items-center gap-3">
          <Link to="/mentions-legales" className="hover:underline transition duration-200">
            Mentions légales
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/confidentialite" className="hover:underline transition duration-200">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
