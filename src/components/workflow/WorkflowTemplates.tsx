import React from 'react';
import { ArrowRight, Copy, Star } from 'lucide-react';

interface WorkflowTemplatesProps {
  onUseTemplate: () => void;
}

const templates = [
  {
    id: '1',
    name: 'Réponse Automatique LinkedIn',
    description:
      'Répond automatiquement aux nouvelles connexions LinkedIn avec un message personnalisé',
    category: 'Networking',
    popularity: 'Populaire',
    complexity: 'Facile',
  },
  {
    id: '2',
    name: 'Publication Sociale depuis Excel',
    description:
      'Publie automatiquement sur Instagram le contenu listé dans un fichier Excel',
    category: 'Marketing',
    popularity: 'Tendance',
    complexity: 'Moyen',
  },
  {
    id: '3',
    name: 'Génération de Contenu Marketing',
    description:
      'Utilise OpenAI pour générer du contenu marketing et l\'envoyer par email',
    category: 'Marketing',
    popularity: 'Nouveau',
    complexity: 'Avancé',
  },
];

export const WorkflowTemplates: React.FC<WorkflowTemplatesProps> = ({
  onUseTemplate,
}) => {
  return (
    <div className="space-y-6">
      {/* Catégories */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium whitespace-nowrap">
          Tous
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50">
          Marketing
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50">
          Ventes
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50">
          Networking
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50">
          Support Client
        </button>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-200 transition-colors p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  {template.popularity === 'Populaire' && (
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-600">
                {template.category}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {template.complexity}
              </span>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={onUseTemplate}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <span>Utiliser</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Copy className="h-4 w-4" />
                <span>Dupliquer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};