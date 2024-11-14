import React, { useState, useCallback } from 'react';
import { X, ArrowRight, Plus, Save, Play, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';
import { ModulePalette } from './editor/ModulePalette';
import { ConstructionCanvas } from './editor/ConstructionCanvas';
import { MiniMap } from './editor/MiniMap';
import { WorkflowModule, Position } from '../../types/workflow';
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowBuilderProps {
  onClose: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onClose }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [modules, setModules] = useState<WorkflowModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const { saveWorkflow } = useWorkflowExecution();
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleModuleMove = useCallback((moduleId: string, position: Position) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, position } : module
    ));
  }, []);

  const handleModuleConnect = useCallback((sourceId: string, targetId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === sourceId) {
        return {
          ...module,
          connections: [...module.connections, targetId]
        };
      }
      return module;
    }));
  }, []);

  const handleModuleDelete = useCallback((moduleId: string) => {
    setModules(prev => {
      // Supprimer toutes les connexions vers ce module
      const updatedModules = prev.map(module => ({
        ...module,
        connections: module.connections.filter(id => id !== moduleId)
      }));
      // Supprimer le module lui-même
      return updatedModules.filter(module => module.id !== moduleId);
    });
    if (selectedModule === moduleId) {
      setSelectedModule(null);
    }
  }, [selectedModule]);

  const handleAddModule = useCallback((type: string, id: string, position: Position, name: string) => {
    const newModule: WorkflowModule = {
      id,
      type,
      name,
      position,
      config: {},
      connections: []
    };

    setModules(prev => [...prev, newModule]);
    setSelectedModule(id);
  }, []);

  const handleCanvasScroll = useCallback((x: number, y: number) => {
    if (canvasRef.current) {
      canvasRef.current.scrollTo(x, y);
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleSave = useCallback(() => {
    if (!workflowName.trim()) {
      setError('Le nom du workflow est requis');
      return;
    }

    const result = saveWorkflow({
      name: workflowName,
      description: workflowDescription,
      modules
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.errors?.join('\n') || 'Erreur lors de la sauvegarde');
    }
  }, [workflowName, workflowDescription, modules, saveWorkflow, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Nom du workflow"
                className="w-full text-xl font-semibold text-gray-900 border-0 focus:ring-0 placeholder-gray-400"
              />
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Description (optionnelle)"
                className="w-full text-sm text-gray-500 border-0 focus:ring-0 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save className="h-5 w-5" />
                <span>Sauvegarder</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          <ModulePalette onModuleSelect={handleAddModule} />
          
          <div className="flex-1 relative">
            <ConstructionCanvas
              ref={canvasRef}
              modules={modules}
              selectedModule={selectedModule}
              zoom={zoom}
              onModuleMove={handleModuleMove}
              onModuleConnect={handleModuleConnect}
              onModuleDelete={handleModuleDelete}
              onModuleSelect={setSelectedModule}
              onModuleAdd={handleAddModule}
            />
            
            <div className="absolute bottom-4 right-4">
              <MiniMap
                modules={modules}
                canvasRef={canvasRef}
                zoom={zoom}
                onPositionChange={handleCanvasScroll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};