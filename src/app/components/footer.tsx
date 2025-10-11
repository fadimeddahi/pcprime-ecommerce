import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#181818] to-black border-t-4 border-[#00d4ff]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Prime Computer Logo"
                className="w-16 h-16 rounded-full border-4 border-[#00d4ff] bg-[#232323] shadow-lg shadow-[#00d4ff]/50"
              />
              <h3 className="ml-3 text-2xl font-bold bg-gradient-to-r from-[#fe8002] to-[#00d4ff] bg-clip-text text-transparent">Prime Computer</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre destination pour des ordinateurs et composants de haute qualité. 
              Nous offrons les meilleures solutions informatiques pour tous vos besoins.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#00d4ff] font-bold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/pc-builder" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  PC Builder
                </a>
              </li>
              <li>
                <a href="/espace-society" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Espace Society
                </a>
              </li>
              <li>
                <a href="/zone-docassion" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Zone d'occasion
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#fe8002] font-bold text-lg mb-4">Catégories</h4>
            <ul className="space-y-2">
              <li>
                <a href="/category/pc-portable" className="text-gray-400 hover:text-[#fe8002] transition-colors text-sm">
                  PC Portable
                </a>
              </li>
              <li>
                <a href="/category/pc-bureau" className="text-gray-400 hover:text-[#fe8002] transition-colors text-sm">
                  PC Bureau
                </a>
              </li>
              <li>
                <a href="/category/composants" className="text-gray-400 hover:text-[#fe8002] transition-colors text-sm">
                  Composants
                </a>
              </li>
              <li>
                <a href="/category/accessoires" className="text-gray-400 hover:text-[#fe8002] transition-colors text-sm">
                  Accessoires
                </a>
              </li>
              <li>
                <a href="/category/ecrans" className="text-gray-400 hover:text-[#fe8002] transition-colors text-sm">
                  Écrans
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#fe8002] font-bold text-lg mb-4">Contactez-nous</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-[#fe8002] mt-1 mr-3 flex-shrink-0" />
                <span>123 Rue Didouche Mourad, Alger, Algérie</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <FaPhone className="text-[#fe8002] mr-3" />
                <span>+213 21 123 456</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <FaEnvelope className="text-[#fe8002] mr-3" />
                <span>contact@primecomputer.dz</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-white font-semibold text-sm mb-3">Suivez-nous</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-[#00d4ff] hover:text-[#fe8002] transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-[#00d4ff] hover:text-[#fe8002] transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-[#00d4ff] hover:text-[#fe8002] transition-colors">
                  <FaLinkedin size={20} />
                </a>
                <a href="#" className="text-[#00d4ff] hover:text-[#fe8002] transition-colors">
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#232323] mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
              © 2025 Prime Computer. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-500 hover:text-[#00d4ff] transition-colors text-sm">
                Politique de confidentialité
              </a>
              <a href="/terms" className="text-gray-500 hover:text-[#00d4ff] transition-colors text-sm">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
