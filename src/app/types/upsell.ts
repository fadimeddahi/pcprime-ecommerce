export interface UpsellOffer {
  id: number | string;
  uuid?: string;
  name: string;
  price: number;
  old_price?: number;
  discount?: number;
  image: string;
  is_promo: boolean;
  category: string;
  stock?: number;
}

export interface RecommendationRule {
  category: string;
  suggestCategories: string[];
}

// Recommendation rules based on category
export const RECOMMENDATION_RULES: RecommendationRule[] = [
  { category: 'Carte Mère', suggestCategories: ['Processeur', 'RAM', 'Stockage'] },
  { category: 'Processeur', suggestCategories: ['Carte Mère', 'Refroidissement', 'RAM'] },
  { category: 'Boîtier', suggestCategories: ['Alimentation', 'Ventilateur', 'Refroidissement'] },
  { category: 'Carte Graphique', suggestCategories: ['Alimentation', 'Écran', 'Boîtier'] },
  { category: 'Ordinateur Portable', suggestCategories: ['Souris', 'Clavier', 'Casque', 'Sac'] },
  { category: 'Écran', suggestCategories: ['Carte Graphique', 'Clavier', 'Souris'] },
  { category: 'RAM', suggestCategories: ['Carte Mère', 'Processeur', 'Stockage'] },
  { category: 'Stockage', suggestCategories: ['RAM', 'Carte Mère', 'Boîtier'] },
];

export const getRecommendedCategories = (category: string): string[] => {
  const rule = RECOMMENDATION_RULES.find(r => r.category === category);
  return rule ? rule.suggestCategories : [];
};
