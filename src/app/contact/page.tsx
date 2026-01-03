"use client";

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTiktok, FaPaperPlane, FaWhatsapp } from "react-icons/fa";

const ContactPage = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log("Contact Form Data:", formData);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }, 1500);
  };

  return (
    <main className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      
      {/* Subtle orange accent gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-extrabold px-8 py-3 rounded-full shadow-2xl shadow-[#fe8002]/60 border-2 border-white/20 uppercase tracking-wider hover:scale-105 transition-all">
              CONTACTEZ-NOUS
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-sm">
            Nous Sommes À Votre Écoute
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-6 shadow-sm" />
          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-semibold ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Une question ? Un projet ? N'hésitez pas à nous contacter.{" "}
            <span className="text-[#fe8002] font-bold">Notre équipe</span> est là pour vous accompagner.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative z-10 py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone */}
            <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/40 shadow-xl hover:shadow-2xl hover:shadow-[#fe8002]/30 transition-all duration-300 hover:scale-105 group ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="bg-gradient-to-br from-[#fe8002] to-[#ff4500] w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#fe8002]/50">
                <FaPhone className="text-white text-2xl" />
              </div>
              <h3 className="text-[#fe8002] font-extrabold text-lg mb-2 uppercase tracking-wide">TÉLÉPHONE</h3>
              <p className={`font-semibold mb-1 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                <a href="tel:+213560452679">0560 45 26 79</a>
              </p>
              <p className={`text-sm mb-2 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>Lun - Sam: 9h - 18h</p>
              <p className={`text-xs font-bold ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>Espace Entreprise</p>
            </div>

            {/* Email */}
            <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/40 shadow-xl hover:shadow-2xl hover:shadow-[#fe8002]/30 transition-all duration-300 hover:scale-105 group ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="bg-gradient-to-br from-[#fe8002] to-[#ff4500] w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#fe8002]/50">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h3 className="text-[#fe8002] font-extrabold text-lg mb-2 uppercase tracking-wide">EMAIL</h3>
              <p className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>contact@primecomputer.dz</p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Réponse sous 24h</p>
            </div>

            {/* Address */}
            <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/40 shadow-xl hover:shadow-2xl hover:shadow-[#fe8002]/30 transition-all duration-300 hover:scale-105 group ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="bg-gradient-to-br from-[#fe8002] to-[#ff4500] w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#fe8002]/50">
                <FaMapMarkerAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-[#fe8002] font-extrabold text-lg mb-2 uppercase tracking-wide">ADRESSE</h3>
              <p className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Rte de Bab Ezzouar</p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Bab Ezzouar 16042, Algérie</p>
            </div>

            {/* Hours */}
            <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/40 shadow-xl hover:shadow-2xl hover:shadow-[#fe8002]/30 transition-all duration-300 hover:scale-105 group ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="bg-gradient-to-br from-[#fe8002] to-[#ff4500] w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#fe8002]/50">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-[#fe8002] font-extrabold text-lg mb-2 uppercase tracking-wide">HORAIRES</h3>
              <p className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Lun - Sam: 9h - 18h</p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Dimanche: Fermé</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className={`rounded-2xl p-6 md:p-8 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
              theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
                <h2 className="text-[#fe8002] font-extrabold text-2xl uppercase tracking-wide">ENVOYEZ-NOUS UN MESSAGE</h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
                    <FaPaperPlane className="text-white text-3xl" />
                  </div>
                  <h3 className={`text-2xl font-extrabold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Message envoyé !</h3>
                  <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`font-bold text-sm mb-2 block uppercase tracking-wide ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        NOM COMPLET
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fe8002] focus:ring-2 focus:ring-[#fe8002]/20 transition-all ${
                          theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                        }`}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className={`font-bold text-sm mb-2 block uppercase tracking-wide ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fe8002] focus:ring-2 focus:ring-[#fe8002]/20 transition-all ${
                          theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                        }`}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`font-bold text-sm mb-2 block uppercase tracking-wide ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        TÉLÉPHONE
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fe8002] focus:ring-2 focus:ring-[#fe8002]/20 transition-all ${
                          theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                        }`}
                        placeholder="+213 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className={`font-bold text-sm mb-2 block uppercase tracking-wide ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        SUJET
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fe8002] focus:ring-2 focus:ring-[#fe8002]/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZlODAwMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-12 ${
                          theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                        }`}
                      >
                        <option value="">SÉLECTIONNEZ UN SUJET</option>
                        <option value="info">DEMANDE D'INFORMATION</option>
                        <option value="devis">DEMANDE DE DEVIS</option>
                        <option value="sav">SERVICE APRÈS-VENTE</option>
                        <option value="autre">AUTRE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`font-bold text-sm mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      MESSAGE
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fe8002] focus:ring-2 focus:ring-[#fe8002]/20 transition-all resize-none ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wider border-2 border-white/30 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ENVOI EN COURS...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-lg" />
                          ENVOYER LE MESSAGE
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Map & Social */}
            <div className="space-y-6">
              {/* Map */}
              <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl h-[400px] ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
                  <h2 className="text-[#fe8002] font-extrabold text-2xl uppercase tracking-wide">NOTRE LOCALISATION</h2>
                </div>
                <div className="w-full h-[calc(100%-60px)] rounded-xl border-2 border-[#fe8002]/40 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.4732088776906!2d3.1823853!3d36.7232400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e519ace5517db%3A0xd0302c3c915b1710!2sPC%20DZ%20%E2%80%98Prime%20Computer%20Dz%E2%80%99!5e0!3m2!1sen!2sdz!4v1704297600000!5m2!1sen!2sdz"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
                  <h2 className="text-[#fe8002] font-extrabold text-2xl uppercase tracking-wide">SUIVEZ-NOUS</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://www.facebook.com/prime.computer.dz.bbz16"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl p-4 border-2 border-[#fe8002]/40 hover:border-[#fe8002] transition-all duration-300 hover:scale-105 group flex items-center gap-3 ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
                    }`}
                  >
                    <FaFacebook className="text-[#fe8002] text-3xl group-hover:scale-125 transition-transform" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>FACEBOOK</span>
                  </a>
                  <a
                    href="https://www.instagram.com/pcdz16bbz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl p-4 border-2 border-[#fe8002]/40 hover:border-[#fe8002] transition-all duration-300 hover:scale-105 group flex items-center gap-3 ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
                    }`}
                  >
                    <FaInstagram className="text-[#fe8002] text-3xl group-hover:scale-125 transition-transform" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>INSTAGRAM</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@primecomputerdz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl p-4 border-2 border-[#fe8002]/40 hover:border-[#fe8002] transition-all duration-300 hover:scale-105 group flex items-center gap-3 ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
                    }`}
                  >
                    <FaTiktok className="text-[#fe8002] text-3xl group-hover:scale-125 transition-transform" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>TIKTOK</span>
                  </a>
                  <a
                    href="https://wa.me/213562068587"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-xl p-4 border-2 border-[#fe8002]/40 hover:border-[#fe8002] transition-all duration-300 hover:scale-105 group flex items-center gap-3 ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
                    }`}
                  >
                    <FaWhatsapp className="text-[#fe8002] text-3xl group-hover:scale-125 transition-transform" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>WHATSAPP</span>
                  </a>
                </div>
                    <FaTwitter className="text-[#fe8002] text-3xl group-hover:scale-125 transition-transform" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>TWITTER</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
