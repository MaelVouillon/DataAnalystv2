import React from 'react';
import { Mail, FileSpreadsheet, Linkedin, Instagram, Bot } from 'lucide-react';

interface TriggerSelectorProps {
  onSelect: (trigger: string) => void;
}

const triggers = [
  {
    id: 'gmail-new-email',
    name: 'Nouvel Email Gmail',
    description: 'Se déclenche à la réception d\'un nouvel email',
    icon: Mail,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    service: 'Gmail',
  },
  {
    id: 'excel-update',
    name: 'Mise à jour Excel',
    description: 'Se déclenche lors de la modification d\'un fichier Excel',
    icon: FileSpreadsheet,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    service: 'Excel',
  },
  {
    id: 'linkedin-connection',
    name: 'Nouvelle Connexion LinkedIn',
    description: 'Se déclenche lors d\'une nouvelle connexion',
    icon: Linkedin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    service: 'LinkedIn',
  },
  {
    id: 'instagram-mention',
    name: 'Mention Instagram',
    description: 'Se déclenche lors d\'une mention dans un post',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    service: 'Instagram',
  },
  {
    id: 'openai-completion',
    name: 'Génération OpenAI',
    description: 'Se déclenche après une génération de contenu',
    icon: Bot,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    service: 'OpenAI',
  },
];

export const TriggerSelector: React.FC<TriggerSelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Choisir un Déclencheur
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sélectionnez l'événement qui déclenchera votre workflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          return (
            <button
              key={trigger.id}
              onClick={() => onSelect(trigger.id)}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-200 bg-white transition-all hover:shadow-sm text-left"
            >
              <div
                className={`p-2 rounded-lg ${trigger.bgColor} ${trigger.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {trigger.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {trigger.service}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {trigger.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};