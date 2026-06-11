import assets, { footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-12 sm:mt-16 md:mt-24 bg-primary/10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10 py-6 md:py-10 border-b border-gray-500/30 text-gray-500">

        <div className="w-full md:w-auto">
          <img className="w-24 sm:w-28 md:w-36" src={assets.logo} alt="logo" />
          <p className="text-xs sm:text-sm max-w-full md:max-w-[410px] mt-3 md:mt-6 leading-relaxed">
            Chez RetroFit, chaque vêtement a une histoire. Trouvez des pièces vintage uniques, économisez tout en faisant un geste pour la planète. La mode durable commence ici.
          </p>
        </div>

        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-4 md:gap-5">
          {footerLinks.map((section, index) => (
            <div key={index} className="min-w-[28%] sm:min-w-0">
              <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-2 md:mb-5">
                {section.title}
              </h3>
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

      <p className="py-3 md:py-4 text-center text-xs sm:text-sm md:text-base text-gray-500/80">
        Copyright © 2026 RetroFit — Mode vintage durable
      </p>
    </div>
  );
};

export default Footer;
