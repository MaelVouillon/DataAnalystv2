import { Category } from '../types/categorization';

export const predefinedCategories: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    route: '/finance',
    keywords: [
      { keyword: 'montant', weight: 1 },
      { keyword: 'trésorerie', weight: 1 },
      { keyword: 'revenu', weight: 1 },
      { keyword: 'dépense', weight: 1 },
      { keyword: 'profit', weight: 1 },
      { keyword: 'marge', weight: 0.8 },
      { keyword: 'budget', weight: 0.8 },
      { keyword: 'coût', weight: 0.8 },
      { keyword: 'prix', weight: 0.7 },
      { keyword: 'facture', weight: 0.7 },
      { keyword: 'compte', weight: 0.6 },
      { keyword: 'balance', weight: 0.6 },
      { keyword: 'transaction', weight: 0.6 }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    route: '/marketing',
    keywords: [
      { keyword: 'campagne', weight: 1 },
      { keyword: 'audience', weight: 1 },
      { keyword: 'conversion', weight: 1 },
      { keyword: 'clic', weight: 1 },
      { keyword: 'impression', weight: 1 },
      { keyword: 'engagement', weight: 0.8 },
      { keyword: 'roi marketing', weight: 0.8 },
      { keyword: 'lead', weight: 0.8 },
      { keyword: 'acquisition', weight: 0.7 },
      { keyword: 'social', weight: 0.7 },
      { keyword: 'email', weight: 0.6 },
      { keyword: 'publicité', weight: 0.6 }
    ]
  },
  {
    id: 'sales',
    name: 'Ventes',
    route: '/sales',
    keywords: [
      { keyword: 'vente', weight: 1 },
      { keyword: 'client', weight: 1 },
      { keyword: 'commande', weight: 1 },
      { keyword: 'produit', weight: 1 },
      { keyword: 'chiffre affaire', weight: 1 },
      { keyword: 'pipeline', weight: 0.8 },
      { keyword: 'opportunité', weight: 0.8 },
      { keyword: 'prospect', weight: 0.8 },
      { keyword: 'devis', weight: 0.7 },
      { keyword: 'commercial', weight: 0.7 },
      { keyword: 'contrat', weight: 0.6 }
    ]
  }
];