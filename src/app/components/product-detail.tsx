"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { Product } from "../types/product";
import { FaShoppingCart, FaHeart, FaStar, FaTruck, FaShieldAlt, FaUndo, FaCheckCircle, FaMinus, FaPlus, FaShare } from "react-icons/fa";
import FeedbackModal from "./feedback-modal";
import UpsellWidget from "./upsell-widget";
import { useRecommendations } from "../hooks/useRecommendations";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { addToCart, isEnterprise } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const productIdNum = Number(product.id);
  const [isFavorite, setIsFavorite] = useState(isInWishlist(productIdNum));
  
  // Get recommendations based on product category
  const { data: recommendations = [] } = useRecommendations(product.category, [productIdNum]);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        uuid: product.uuid,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      quantity,
      isEnterprise // Pass current cart mode
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const toggleFavorite = () => {
    const wishlistItem = {
      id: productIdNum,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };
    
    if (isFavorite) {
      removeFromWishlist(productIdNum);
    } else {
      addToWishlist(wishlistItem);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: product.name,
      text: `Découvrez ${product.name} - ${product.price.toLocaleString('fr-DZ')} DZD sur Prime Computer`,
      url: shareUrl
    };

    try {
      // Try to use native share if available (mobile devices)
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } else {
        // Fallback: copy link to clipboard (desktop)
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
        } else {
          // Older browser fallback
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
        }
      }
    } catch (err: any) {
      // Only show error if it's not a user cancellation
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        alert('Erreur lors du partage. Veuillez réessayer.');
      }
    }
  };

  const incrementQuantity = () => {
    const maxQty = product.quantity || 999;
    setQuantity(prev => (prev < maxQty ? prev + 1 : prev));
  };
  
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Use product image
  const images = [product.image];
  
  // Calculate discount percentage
  const discountPercentage = product.oldPrice || product.old_price
    ? Math.round(((product.oldPrice || product.old_price || 0) - product.price) / (product.oldPrice || product.old_price || 1) * 100)
    : product.discount || 0;

  // Build technical specifications from product data
  const buildSpecs = () => {
    const specs: { label: string; value: string }[] = [];
    
    if (product.cpu) specs.push({ label: "Processeur", value: product.cpu });
    if (product.gpu) specs.push({ label: "Carte Graphique", value: product.gpu });
    if (product.ram) specs.push({ label: "Mémoire RAM", value: product.ram });
    if (product.storage) specs.push({ label: "Stockage", value: product.storage });
    if (product.screen) specs.push({ label: "Écran", value: product.screen });
    if (product.battery) specs.push({ label: "Batterie", value: product.battery });
    if (product.camera) specs.push({ label: "Caméra", value: product.camera });
    if (product.alimentation) specs.push({ label: "Alimentation", value: product.alimentation });
    if (product.boîtier) specs.push({ label: "Boîtier", value: product.boîtier });
    if (product.refroidissement) specs.push({ label: "Refroidissement", value: product.refroidissement });
    if (product.système) specs.push({ label: "Système", value: product.système });
    if (product.brand) specs.push({ label: "Marque", value: product.brand });
    if (product.etat) specs.push({ label: "État", value: product.etat });
    
    return specs;
  };

  const specs = buildSpecs();

  return (
    <section className={`py-12 px-4 min-h-screen relative overflow-hidden transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Subtle orange accent gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <a href="/" className={`hover:text-[#fe8002] transition-colors font-semibold ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>Accueil</a>
          <span className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'}>/</span>
          <span className="text-[#fe8002] font-bold">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className={`relative h-[500px] w-full rounded-3xl overflow-hidden border-4 shadow-2xl ring-4 ${
              theme === 'light'
                ? 'bg-gradient-to-br from-gray-100 to-white border-gray-300/50 shadow-gray-300/50 ring-gray-200/30'
                : 'bg-gradient-to-br from-[#181818] to-[#000000] border-white/20 shadow-white/30 ring-white/10'
            }`}>
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isPromo && (
                  <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-2xl shadow-[#fe8002]/60 backdrop-blur-md border border-white/20 animate-pulse">
                    PROMO
                  </span>
                )}
                {product.isTopSeller && (
                  <span className="bg-gradient-to-r from-[#ff4500] via-[#fe8002] to-[#ff6b35] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-2xl shadow-[#ff4500]/60 backdrop-blur-md border border-white/20">
                    TOP VENTE
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full backdrop-blur-md border-2 transition-all duration-300 ${
                    isFavorite
                      ? "bg-[#fe8002] border-white/20 text-white"
                      : theme === 'light'
                        ? "bg-white/90 border-gray-300 text-[#fe8002] hover:bg-[#fe8002] hover:text-white hover:scale-110"
                        : "bg-black/50 border-white/20 text-white hover:bg-[#fe8002] hover:scale-110"
                  }`}
                >
                  <FaHeart className="text-lg" />
                </button>
                <button 
                  onClick={handleShare}
                  className={`p-3 rounded-full backdrop-blur-md border-2 transition-all duration-300 ${
                    shareSuccess
                      ? "bg-green-500 border-white/20 text-white"
                      : theme === 'light'
                        ? "bg-white/90 border-gray-300 text-[#fe8002] hover:bg-[#fe8002] hover:text-white hover:scale-110"
                        : "bg-black/50 border-white/20 text-white hover:bg-[#fe8002] hover:scale-110"
                  }`}
                  title="Partager ce produit"
                >
                  <FaShare className="text-lg" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-32 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedImage === index
                      ? "border-4 border-[#fe8002] shadow-lg shadow-[#fe8002]/50"
                      : "border-2 border-[#2a2a2a] hover:border-[#fe8002]/50"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${index + 1}`} fill sizes="128px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Sticky Add to Cart Section */}
            <div className={`sticky top-20 z-30 rounded-2xl p-6 border-2 border-[#fe8002] shadow-2xl backdrop-blur-lg ${
              theme === 'light'
                ? 'bg-white/95'
                : 'bg-[#0f0f0f]/95'
            }`}>
              {/* Category Badge */}
              <div className="inline-block mb-3">
                <span className={`text-xs font-bold text-[#fe8002] px-4 py-2 rounded-full border border-[#fe8002]/40 shadow-md shadow-[#fe8002]/20 uppercase tracking-wider ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-gray-50 to-gray-100'
                    : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                }`}>
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className={`text-2xl md:text-3xl font-extrabold leading-tight mb-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {product.name}
              </h1>

              {/* Rating and Sales */}
              {(typeof product.rating !== 'undefined' || (product.number_sold && product.number_sold > 0)) && (
                <div className="flex items-center gap-4 mb-4">
                  {typeof product.rating !== 'undefined' && (
                    <>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating || 0) ? "text-[#fe8002]" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#fe8002] font-bold text-sm">
                        {Number(product.rating).toFixed(1)}
                      </span>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        ({product.reviews || 0} avis)
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Description */}
              <div className={`rounded-xl p-4 mb-4 border ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-gray-50/80 to-white/80 border-gray-300/40'
                  : 'bg-gradient-to-br from-[#1a1a1a]/50 to-[#0f0f0f]/50 border-[#fe8002]/20'
              }`}>
                <p className={`leading-relaxed text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 font-bold text-sm">En stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-red-400 font-bold text-sm">Rupture de stock</span>
                  </>
                )}
              </div>

              {/* Price & Quantity */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    {product.price.toLocaleString('fr-DZ')}
                  </p>
                  <span className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>DZD</span>
                  {product.oldPrice && (
                    <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold ml-2">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-bold text-sm ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>Quantité</span>
                  <div className={`flex items-center gap-3 rounded-lg border-2 border-[#fe8002]/40 p-1 ${
                    theme === 'light' ? 'bg-gray-50' : 'bg-[#0f0f0f]'
                  }`}>
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold rounded-lg hover:scale-110 transition-all"
                    >
                      −
                    </button>
                    <span className={`font-extrabold text-xl w-12 text-center ${
                      theme === 'light' ? 'text-[#fe8002]' : 'text-white'
                    }`}>{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold rounded-lg hover:scale-110 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 rounded-xl font-extrabold text-lg uppercase tracking-wide transition-all duration-300 transform flex items-center justify-center gap-3 ${
                  addedToCart
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white border-2 border-white/30 shadow-xl"
                    : product.inStock
                    ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:scale-105 shadow-xl shadow-[#fe8002]/50 hover:shadow-[#fe8002]/70 border-2 border-white/20"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                {addedToCart ? (
                  <>
                    <FaCheckCircle className="text-2xl" />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="text-2xl" />
                    Ajouter au panier
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={toggleFavorite}
                className={`w-full mt-3 py-3 rounded-xl font-bold transition-all duration-300 border-2 flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-red-500 text-white border-red-500'
                    : theme === 'light'
                      ? 'bg-white text-[#fe8002] border-[#fe8002] hover:bg-[#fe8002] hover:text-white'
                      : 'bg-[#0f0f0f] text-[#fe8002] border-[#fe8002] hover:bg-[#fe8002] hover:text-white'
                }`}
              >
                <FaHeart className="text-xl" />
                {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
            </div>

            {/* Product Info Container */}
            <div className={`rounded-3xl p-8 border-2 border-[#fe8002]/30 shadow-2xl space-y-6 ${
              theme === 'light'
                ? 'bg-white shadow-[#fe8002]/20'
                : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
            {/* Feedback Button */}
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 border-2 flex items-center justify-center gap-3 ${
                theme === 'light'
                  ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                  : 'bg-blue-900/30 border-blue-500 text-blue-300 hover:bg-blue-900/50'
              }`}
            >
              💬 Donner votre avis
            </button>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className={`flex items-center gap-3 p-4 rounded-xl border border-[#fe8002]/20 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white to-gray-50'
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
              }`}>
                <FaTruck className="text-[#fe8002] text-2xl" />
                <div>
                  <p className={`font-bold text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Livraison</p>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{product.delivery_info || "Livraison standard disponible"}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl border border-[#fe8002]/20 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white to-gray-50'
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
              }`}>
                <FaShieldAlt className="text-[#fe8002] text-2xl" />
                <div>
                  <p className={`font-bold text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Garantie</p>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{product.warranty_info || `${product.warranty_months || 12} mois de garantie`}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl border border-[#fe8002]/20 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white to-gray-50'
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
              }`}>
                <FaUndo className="text-[#fe8002] text-2xl" />
                <div>
                  <p className={`font-bold text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Retour</p>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{product.return_policy || "Retour sous 15 jours"}</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {specs.length > 0 && (
          <div className={`rounded-3xl p-8 border-4 shadow-2xl backdrop-blur-xl ring-4 ${
            theme === 'light'
              ? 'bg-white border-gray-300/50 shadow-gray-300/50 ring-gray-200/30'
              : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-white/20 shadow-white/30 ring-white/10'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-1.5 h-10 rounded-full shadow-lg ${
                theme === 'light'
                  ? 'bg-gradient-to-b from-gray-800 via-[#fe8002] to-[#ff4500] shadow-gray-800/50'
                  : 'bg-gradient-to-b from-white via-[#fe8002] to-[#ff4500] shadow-white/50'
              }`} />
              <h2 className={`text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${
                theme === 'light'
                  ? 'from-gray-900 via-[#fe8002] to-gray-900'
                  : 'from-white via-[#fe8002] to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              }`}>
                Caractéristiques Techniques
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specs.map((spec, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl border hover:border-[#fe8002]/40 transition-all ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300/40'
                      : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border-[#fe8002]/20'
                  }`}
                >
                  <span className={`font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{spec.label}</span>
                  <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upsell Widget */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <UpsellWidget
              products={recommendations}
              title="Produits similaires"
              subtitle="Découvrez ces produits complémentaires"
            />
          </div>
        )}

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      </div>
    </section>
  );
};

export default ProductDetail;
