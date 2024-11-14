import React from 'react';
import { Mail, FileSpreadsheet, Linkedin, Instagram, Bot, ArrowRight, Filter, Repeat } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Position } from '../../../types/workflow';

interface ModulePaletteProps {
  onModuleSelect: (type: string, id: string, position: Position, name: string) => void;
}

const moduleCategories = [
  {
    title: 'Déclencheurs',
    modules: [
      {
        id: 'gmail-trigger',
        type: 'trigger',
        name: 'Gmail',
        description: 'Déclenché par un nouvel email',
        icon: Mail,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      },
      {
        id: 'excel-trigger',
        type: 'trigger',
        name: 'Excel',
        description: 'Déclenché par une modification Excel',
        icon: FileSpreadsheet,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        id: 'linkedin-trigger',
        type: 'trigger',
        name: 'LinkedIn',
        description: 'Déclenché par une connexion LinkedIn',
        icon: Linkedin,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }
    ]
  },
  {
    title: 'Actions',
    modules: [
      {
        id: 'send-email',
        type: 'action',
        name: 'Envoyer Email',
        description: 'Envoie un email via Gmail',
        icon: Mail,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      },
      {
        id: 'update-excel',
        type: 'action',
        name: 'Mettre à jour Excel',
        description: 'Met à jour une feuille Excel',
        icon: FileSpreadsheet,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        id: 'post-instagram',
        type: 'action',
        name: 'Poster Instagram',
        description: 'Publie sur Instagram',
        icon: Instagram,
        color: 'text-pink-600',
        bgColor: 'bg-pink-100'
      },
      {
        id: 'generate-content',
        type: 'action',
        name: 'Générer Contenu',
        description: 'Génère du contenu avec OpenAI',
        icon: Bot,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      }
    ]
  },
  {
    title: 'Logique',
    modules: [
      {
        id: 'condition',
        type: 'condition',
        name: 'Condition',
        description: 'Ajoute une condition if/else',
        icon: Filter,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100'
      },
      {
        id: 'loop',
        type: 'loop',
        name: 'Boucle',
        description: 'Répète une action',
        icon: Repeat,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100'
      }
    ]
  }
];

export const ModulePalette: React.FC<ModulePaletteProps> = ({ onModuleSelect }) => {
  const handleDragStart = (e: React.DragEvent, module: any) => {
    e.dataTransfer.setData('moduleType', module.type);
    e.dataTransfer.setData('moduleId', uuidv4());
    e.dataTransfer.setData('moduleName', module.name);
    
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-white p-2 rounded shadow-lg border border-indigo-200';
    dragImage.textContent = module.name;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules</h2>
        
        <div className="space-y-6">
          {moduleCategories.map(category => (
            <div key={category.title}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {category.title}
              </h3>
              
              <div className="space-y-2">
                {category.modules.map(module => {
                  const Icon = module.icon;
                  return (
                    <div
                      key={module.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, module)}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-200 hover:shadow-sm cursor-move bg-white transition-all"
                    >
                      <div className={`p-2 rounded-lg ${module.bgColor}`}>
                        <Icon className={`h-5 w-5 ${module.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {module.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};