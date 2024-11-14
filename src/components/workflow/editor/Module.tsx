import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Settings, Grip } from 'lucide-react';
import { WorkflowModule } from '../../../types/workflow';

interface ModuleProps {
  module: WorkflowModule;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onConnect: (targetId: string) => void;
  onStartConnection: (sourceId: string) => void;
  isValidTarget: boolean;
}

export const Module: React.FC<ModuleProps> = ({
  module,
  selected,
  onMouseDown,
  onDelete,
  onConnect,
  onStartConnection,
  isValidTarget
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const getModuleStyles = () => {
    const baseStyles = 'shadow-lg backdrop-blur-sm backdrop-filter';
    const selectedStyles = selected ? 'ring-2 ring-indigo-500' : '';
    const targetStyles = isValidTarget ? 'ring-2 ring-green-500 animate-pulse' : '';

    switch (module.type) {
      case 'trigger':
        return `${baseStyles} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 ${selectedStyles} ${targetStyles}`;
      case 'action':
        return `${baseStyles} bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 ${selectedStyles} ${targetStyles}`;
      case 'condition':
        return `${baseStyles} bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 ${selectedStyles} ${targetStyles}`;
      case 'loop':
        return `${baseStyles} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 ${selectedStyles} ${targetStyles}`;
      default:
        return `${baseStyles} bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 ${selectedStyles} ${targetStyles}`;
    }
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnect(module.id);
  };

  const handleStartConnection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection(module.id);
  };

  return (
    <div
      className={`absolute p-4 rounded-xl border transition-all ${getModuleStyles()}`}
      style={{
        left: module.position.x,
        top: module.position.y,
        minWidth: '240px',
        transform: 'translate(-50%, -50%)',
        zIndex: selected ? 10 : 1
      }}
    >
      {/* Handle de déplacement */}
      <div 
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 cursor-move p-1 rounded-full bg-white shadow-md border border-gray-200"
        onMouseDown={onMouseDown}
      >
        <Grip className="h-4 w-4 text-gray-500" />
      </div>

      {/* En-tête du module */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium">{module.name}</h3>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            module.type === 'trigger' ? 'bg-blue-100 text-blue-700' :
            module.type === 'action' ? 'bg-emerald-100 text-emerald-700' :
            module.type === 'condition' ? 'bg-amber-100 text-amber-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {module.type}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Points de connexion */}
      {module.type !== 'trigger' && (
        <div 
          className="absolute -left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={handleConnect}
        >
          <div className={`p-1.5 bg-white rounded-full shadow-lg border-2 transition-all
            ${isValidTarget ? 'border-green-500 scale-125' : 'border-gray-200'}
            hover:scale-110`}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      )}

      <div 
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={handleStartConnection}
      >
        <div className="p-1.5 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:scale-110 transition-all">
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </div>
      </div>

      {/* Configuration */}
      {showSettings && (
        <div className="mt-2 p-3 bg-white/80 rounded-lg border border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Configuration</h4>
          {/* Ajouter les champs de configuration spécifiques au type de module */}
        </div>
      )}
    </div>
  );
};