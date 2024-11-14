import React from 'react';
import { DomainCards } from '../components/DomainCards';
import { AlertSection } from '../components/AlertSection';
import { QuickActions } from '../components/QuickActions';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500">Bienvenue sur votre espace d'analyse de données</p>
        </div>

        {/* Contenu Principal */}
        <DomainCards />
        <AlertSection />
        <QuickActions />
      </div>
    </div>
  );
};