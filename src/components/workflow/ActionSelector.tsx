import React from 'react';
import { Mail, FileSpreadsheet, Linkedin, Instagram, Bot, Send } from 'lucide-react';

interface ActionSelectorProps {
  onSelect: (action: string) => void;
}

const actions = [
  {
    id: 'gmail-send',
    name: 'Envoyer un Email',
    description: 'Envoie un email via Gmail',
    icon: Send,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    service: 'Gmail',
  },
  {
    id: 'excel-update',
    name: 'Mettre à jour Excel',
    description: 'Met à jour une feuille Excel',
    icon: FileSpreadsheet,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    service: 'Excel',
  },
  {
    id: 'linkedin-message',
    name: 'Message LinkedIn',
    description: 'Envoie un message LinkedIn',
    icon: Linkedin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    service: 'LinkedIn',
  },
  {
    id: 'instagram-post',
    name: 'Publication Instagram',
    description: 'Crée une publication Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    service: 'Instagram',
  },
  {
    id: 'openai-generate',
    name: 'Générer du Contenu',
    description: 'Génère du contenu avec OpenAI',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    service: 'OpenAI',
  },
];

export const ActionSelector: React.FC<ActionSelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Choisir une Action
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sélectionnez l'action à exécuter lorsque le déclencheur est activé
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.id)}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-200 bg-white transition-all hover:shadow-sm text-left"
            >
              <div
                className={`p-2 rounded-lg ${action.bgColor} ${action.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {action.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {action.service}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};