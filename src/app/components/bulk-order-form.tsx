"use client";

import { useState } from "react";
import { FaShoppingCart, FaPlus, FaTrash, FaCalculator } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { bulkOrderApi, BulkOrderRequest, BulkOrderItem } from "../services/espaceSocietyApi";

interface BulkOrderFormProps {
  companyId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const BulkOrderForm = ({ companyId, onSuccess, onError }: BulkOrderFormProps) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<BulkOrderItem[]>([
    { productId: "", quantity: 1, unitPrice: 0, subtotal: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === "quantity") {
      item.quantity = parseInt(value) || 0;
    } else if (field === "unitPrice") {
      item.unitPrice = parseFloat(value) || 0;
    } else if (field === "productId") {
      item.productId = value;
    }
    
    // Recalculate subtotal
    item.subtotal = item.quantity * item.unitPrice;
    if (item.discount) {
      item.subtotal -= (item.subtotal * item.discount) / 100;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Veuillez ajouter au moins un article");
      return;
    }

    if (items.some((item) => !item.productId || item.quantity <= 0)) {
      setError("Veuillez remplir tous les articles");
      return;
    }

    setIsLoading(true);

    try {
      const request: BulkOrderRequest = {
        items,
        notes,
        deliveryAddress,
      };

      await bulkOrderApi.createOrder(companyId, request);
      setItems([{ productId: "", quantity: 1, unitPrice: 0, subtotal: 0 }]);
      setNotes("");
      setDeliveryAddress("");
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.message || "Erreur lors de la création de la commande";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${
      theme === 'light'
        ? 'bg-white'
        : 'bg-[#1a1a1a] border border-[#2a2a2a]'
    } p-8 rounded-lg`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaShoppingCart className="text-[#fe8002] text-2xl" />
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Nouvelle Commande en Gros
        </h2>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#2a2a2a]'}`}>
              <th className={`text-left py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Produit
              </th>
              <th className={`text-center py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Quantité
              </th>
              <th className={`text-right py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Prix Unitaire
              </th>
              <th className={`text-right py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Sous-Total
              </th>
              <th className={`text-center py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#2a2a2a]'}`}
              >
                <td className="py-4 px-4">
                  <input
                    type="text"
                    placeholder="ID ou Nom du produit"
                    value={item.productId}
                    onChange={(e) => updateItem(index, "productId", e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-[#0f0f0f] border-[#2a2a2a]'
                    }`}
                  />
                </td>
                <td className="py-4 px-4 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    className={`w-20 px-3 py-2 border rounded text-center ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-[#0f0f0f] border-[#2a2a2a]'
                    }`}
                  />
                </td>
                <td className="py-4 px-4 text-right">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                    placeholder="0.00"
                    className={`w-32 px-3 py-2 border rounded text-right ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-[#0f0f0f] border-[#2a2a2a]'
                    }`}
                  />
                  <span className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    DA
                  </span>
                </td>
                <td className={`py-4 px-4 text-right font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {item.subtotal.toLocaleString()} DA
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 bg-[#fe8002] text-white rounded-lg font-bold hover:bg-[#ff4500] transition-colors"
      >
        <FaPlus /> Ajouter Produit
      </button>

      {/* Delivery Address */}
      <div>
        <label className={`text-sm font-bold mb-2 block ${
          theme === 'light' ? 'text-gray-800' : 'text-white'
        }`}>
          Adresse de Livraison
        </label>
        <textarea
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Adresse de livraison"
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg font-medium ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-[#0f0f0f] border-[#2a2a2a]'
          }`}
        />
      </div>

      {/* Notes */}
      <div>
        <label className={`text-sm font-bold mb-2 block ${
          theme === 'light' ? 'text-gray-800' : 'text-white'
        }`}>
          Notes Spéciales
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes additionnelles (conditions spéciales, instructions, etc.)"
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg font-medium ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-[#0f0f0f] border-[#2a2a2a]'
          }`}
        />
      </div>

      {/* Total Amount */}
      <div className={`flex items-center justify-between p-4 rounded-lg ${
        theme === 'light'
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-blue-500/10 border border-blue-500/30'
      }`}>
        <div className="flex items-center gap-2">
          <FaCalculator className="text-[#fe8002]" />
          <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Montant Total:
          </span>
        </div>
        <span className="text-2xl font-bold text-[#fe8002]">
          {getTotalAmount().toLocaleString()} DA
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || items.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 ${
          isLoading || items.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
        }`}
      >
        {isLoading ? "Soumission en cours..." : "Soumettre la Commande"}
      </button>
    </form>
  );
};

export default BulkOrderForm;
