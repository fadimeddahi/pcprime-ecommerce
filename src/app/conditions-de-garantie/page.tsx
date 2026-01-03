"use client";

import { useTheme } from '../context/ThemeContext';
import { FaShieldAlt, FaLaptop, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const WarrantyPage = () => {
  const { theme } = useTheme();

  return (
    <main className={`min-h-screen transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#fe8002]/10 via-transparent to-[#ff4500]/10" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-[#fe8002] text-5xl" />
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent">
                Conditions de Garantie
              </h1>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-8" />
            <p className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Votre satisfaction et la qualité de nos produits sont notre priorité
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* 1. Acceptation */}
          <div className={`mb-8 rounded-2xl p-8 border-2 shadow-xl ${
            theme === 'light'
              ? 'bg-white border-[#fe8002]/30'
              : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#fe8002] to-[#ff4500] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-extrabold text-xl">1</span>
              </div>
              <div className="flex-1">
                <h2 className={`text-3xl font-extrabold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Acceptation
                </h2>
                <p className={`text-lg leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Le paiement du prix du produit vaut acceptation des présentes conditions de garantie.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Couverture */}
          <div className={`mb-8 rounded-2xl p-8 border-2 shadow-xl ${
            theme === 'light'
              ? 'bg-white border-[#fe8002]/30'
              : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#fe8002] to-[#ff4500] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-extrabold text-xl">2</span>
              </div>
              <div className="flex-1">
                <h2 className={`text-3xl font-extrabold mb-6 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Couverture
                </h2>

                <div className="space-y-6">
                  {/* Matériel */}
                  <div className={`rounded-xl p-6 border ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-green-50 to-white border-green-300'
                      : 'bg-gradient-to-br from-green-900/20 to-[#0f0f0f] border-green-600/30'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <FaCheckCircle className="text-green-500 text-2xl" />
                      <h3 className={`text-xl font-bold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Matériel
                      </h3>
                    </div>
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      La garantie couvre les défauts de matériel et de construction.
                    </p>
                  </div>

                  {/* Durée */}
                  <div className={`rounded-xl p-6 border ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-blue-50 to-white border-blue-300'
                      : 'bg-gradient-to-br from-blue-900/20 to-[#0f0f0f] border-blue-600/30'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <FaShieldAlt className="text-blue-500 text-2xl" />
                      <h3 className={`text-xl font-bold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Durée
                      </h3>
                    </div>
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Tous les produits bénéficient d'une garantie limitée dont la durée est indiquée dans la rubrique "Informations supplémentaires".
                    </p>
                  </div>

                  {/* Logiciel */}
                  <div className={`rounded-xl p-6 border ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-orange-50 to-white border-orange-300'
                      : 'bg-gradient-to-br from-orange-900/20 to-[#0f0f0f] border-orange-600/30'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <FaExclamationTriangle className="text-orange-500 text-2xl" />
                      <h3 className={`text-xl font-bold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Logiciel
                      </h3>
                    </div>
                    <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Les problèmes de logiciels et de pilotes (drivers) ne sont pas couverts. Nos techniciens peuvent aider dans certains cas, mais sans obligation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Spécificités pour les Laptops */}
          <div className={`mb-8 rounded-2xl p-8 border-2 shadow-xl ${
            theme === 'light'
              ? 'bg-white border-[#fe8002]/30'
              : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#fe8002] to-[#ff4500] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-extrabold text-xl">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <FaLaptop className="text-[#fe8002] text-3xl" />
                  <h2 className={`text-3xl font-extrabold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Spécificités pour les Laptops
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className={`p-6 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-[#0f0f0f] border-[#fe8002]/20'
                  }`}>
                    <h3 className={`text-lg font-bold mb-2 text-[#fe8002]`}>
                      Périphériques (Écran, Clavier, Haut-parleurs)
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Ces composants bénéficient d'une "garantie de marche". Ils doivent être vérifiés au moment de l'achat. Après ce test, la garantie prend fin pour ces éléments.
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-[#0f0f0f] border-[#fe8002]/20'
                  }`}>
                    <h3 className={`text-lg font-bold mb-2 text-[#fe8002]`}>
                      Batterie
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      La garantie de la batterie est de deux semaines.
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-[#0f0f0f] border-[#fe8002]/20'
                  }`}>
                    <h3 className={`text-lg font-bold mb-2 text-[#fe8002]`}>
                      PC Gamer
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Vous avez droit à un changement gratuit de pâte thermique durant la période de garantie si le PC surchauffe (+90°C).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Annulation de la Garantie */}
          <div className={`mb-8 rounded-2xl p-8 border-2 shadow-xl ${
            theme === 'light'
              ? 'bg-red-50 border-red-400'
              : 'bg-gradient-to-br from-red-900/20 to-[#0f0f0f] border-red-600/40'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-extrabold text-xl">4</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <FaTimesCircle className="text-red-500 text-3xl" />
                  <h2 className={`text-3xl font-extrabold ${
                    theme === 'light' ? 'text-red-900' : 'text-red-400'
                  }`}>
                    Annulation de la Garantie
                  </h2>
                </div>

                <div className="space-y-4">
                  <p className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-red-800' : 'text-red-300'
                  }`}>
                    La garantie est immédiatement annulée en cas de :
                  </p>
                  <ul className={`space-y-3 text-lg ${
                    theme === 'light' ? 'text-red-700' : 'text-red-200'
                  }`}>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold mt-1">•</span>
                      <span>Dommages physiques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold mt-1">•</span>
                      <span>Utilisation abusive</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold mt-1">•</span>
                      <span>Retrait de l'étiquette de garantie</span>
                    </li>
                  </ul>

                  <div className={`mt-6 p-4 rounded-xl border-2 ${
                    theme === 'light'
                      ? 'bg-red-100 border-red-400'
                      : 'bg-red-900/30 border-red-500/50'
                  }`}>
                    <p className={`font-bold text-lg ${
                      theme === 'light' ? 'text-red-900' : 'text-red-300'
                    }`}>
                      ⚠️ IMPORTANT : Ne confiez jamais votre produit à un autre réparateur ou revendeur, car cela pourrait annuler votre garantie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Réclamations */}
          <div className={`mb-8 rounded-2xl p-8 border-2 shadow-xl ${
            theme === 'light'
              ? 'bg-white border-[#fe8002]/30'
              : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#fe8002] to-[#ff4500] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-extrabold text-xl">5</span>
              </div>
              <div className="flex-1">
                <h2 className={`text-3xl font-extrabold mb-6 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Réclamations
                </h2>

                <div className="space-y-4">
                  <div className={`p-6 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-[#0f0f0f] border-[#fe8002]/20'
                  }`}>
                    <h3 className={`text-lg font-bold mb-2 text-[#fe8002]`}>
                      Défauts
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Si le produit est jugé défectueux, il sera réparé, échangé ou remboursé.
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-[#0f0f0f] border-[#fe8002]/20'
                  }`}>
                    <h3 className={`text-lg font-bold mb-2 text-[#fe8002]`}>
                      Procédure
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Contactez-nous immédiatement en cas de problème.
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-[#0f0f0f] border-[#fe8002]/20'
                  }`}>
                    <h3 className={`text-lg font-bold mb-2 text-[#fe8002]`}>
                      Exclusions
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      La garantie ne couvre pas les problèmes signalés par le vendeur avant l'achat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className={`rounded-2xl p-10 border-2 text-center ${
            theme === 'light'
              ? 'bg-gradient-to-br from-[#fe8002]/10 to-white border-[#fe8002]/40'
              : 'bg-gradient-to-br from-[#fe8002]/10 to-[#0f0f0f] border-[#fe8002]/40'
          }`}>
            <h3 className={`text-2xl font-extrabold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Des Questions sur Votre Garantie ?
            </h3>
            <p className={`text-lg mb-6 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Notre équipe est à votre disposition pour toute information complémentaire
            </p>
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-extrabold py-4 px-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            >
              Contactez-nous
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WarrantyPage;
