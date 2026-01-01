"use client";

import { useState } from "react";
import { FaShoppingCart, FaPlus, FaTrash, FaCalculator, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useCompany } from "../context/CompanyContext";
import { companyOrderApi } from "../services/espaceSocietyApi";
import { OrderItem, CreateCompanyOrderRequest } from "../types/enterprise";

interface BulkOrderFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const BulkOrderForm = ({ onSuccess, onError }: BulkOrderFormProps) => {
  const { theme } = useTheme();
  const { company } = useCompany();
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: "", quantity: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === "quantity") {
      item.quantity = parseInt(value) || 1;
    } else if (field === "product_id") {
      item.product_id = value;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!company) {
      setError("Informations de l'entreprise manquantes");
      return;
    }

    if (items.length === 0) {
      setError("Veuillez ajouter au moins un article");
      return;
    }

    if (items.some((item) => !item.product_id || item.quantity <= 0)) {
      setError("Veuillez remplir tous les articles avec des valeurs valides");
      return;
    }

    setIsLoading(true);

    try {
      const request: CreateCompanyOrderRequest = {
        company_data: {
          company_name: company.name,
          email: company.email,
          phone: company.phone,
          address: company.address || "",
          city: company.city || "",
          tax_id: company.tax_id,
          contact_person: company.contact_person,
          notes: notes,
        },
        cart_items: items,
      };

      const order = await companyOrderApi.createOrder(request);
      setSuccess(true);
      setItems([{ product_id: "", quantity: 1 }]);
      setNotes("");
      
      // Show success message for 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
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

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-pulse">
          <FaCheckCircle /> Commande créée avec succès! En attente de confirmation de l'administrateur.
        </div>
      )}

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#2a2a2a]'}`}>
              <th className={`text-left py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                ID Produit (UUID)
              </th>
              <th className={`text-center py-3 px-4 font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Quantité
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
                    placeholder="UUID du produit (ex: a1b2c3d4...)"
                    value={item.product_id}
                    onChange={(e) => updateItem(index, "product_id", e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-200 text-gray-900'
                        : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
                    }`}
                  />
                </td>
                <td className="py-4 px-4 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    className={`w-24 px-3 py-2 border rounded text-center ${
                      theme === 'light'
                        ? 'bg-gray-50 border-gray-200 text-gray-900'
                        : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
                    }`}
                  />
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className={`transition-colors ${
                      items.length === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-500 hover:text-red-700'
                    }`}
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
          placeholder="Notes additionnelles (conditions spéciales, instructions, livraison urgente, etc.)"
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg font-medium ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-200 text-gray-900'
              : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
          }`}
        />
      </div>

      {/* Info Box */}
      <div className={`p-4 rounded-lg ${
        theme === 'light'
          ? 'bg-blue-50 border border-blue-200 text-blue-800'
          : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
      }`}>
        <p className="text-sm font-medium">
          ℹ️ Le prix total sera calculé automatiquement par le backend. La commande sera en attente de confirmation par un administrateur avant que le stock ne soit réduit.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || items.length === 0 || !company}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 ${
          isLoading || items.length === 0 || !company
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
