import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { WorkflowModule, Position } from '../../../types/workflow';
import { Module } from './Module';
import { Connection } from './Connection';

interface ConstructionCanvasProps {
  modules: WorkflowModule[];
  selectedModule: string | null;
  zoom: number;
  onModuleMove: (moduleId: string, position: Position) => void;
  onModuleConnect: (sourceId: string, targetId: string) => void;
  onModuleDelete: (moduleId: string) => void;
  onModuleSelect: (moduleId: string | null) => void;
  onModuleAdd: (type: string, id: string, position: Position, name: string) => void;
}

export const ConstructionCanvas = forwardRef<HTMLDivElement, ConstructionCanvasProps>(
  ({ modules, selectedModule, zoom, onModuleMove, onModuleConnect, onModuleDelete, onModuleSelect, onModuleAdd }, ref) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [connectionStart, setConnectionStart] = useState<{ id: string; position: Position } | null>(null);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

    const handleCanvasClick = (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onModuleSelect(null);
        setConnectionStart(null);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const moduleType = e.dataTransfer.getData('moduleType');
      const moduleId = e.dataTransfer.getData('moduleId');
      const moduleName = e.dataTransfer.getData('moduleName');

      if (!moduleType || !moduleId || !moduleName || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom
      };

      onModuleAdd(moduleType, moduleId, position, moduleName);
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [zoom]);

    // Générer les connexions avec des identifiants uniques stables
    const connections = React.useMemo(() => {
      const result: Array<{
        id: string;
        sourceId: string;
        targetId: string;
        sourcePosition: Position;
        targetPosition?: Position;
      }> = [];

      modules.forEach(sourceModule => {
        sourceModule.connections.forEach(targetId => {
          const targetModule = modules.find(m => m.id === targetId);
          if (targetModule) {
            // Créer un identifiant unique et stable basé sur les IDs des modules
            const connectionId = `${sourceModule.id}-to-${targetId}`;
            result.push({
              id: connectionId,
              sourceId: sourceModule.id,
              targetId,
              sourcePosition: sourceModule.position,
              targetPosition: targetModule.position
            });
          }
        });
      });

      return result;
    }, [modules]);

    return (
      <div
        ref={(el) => {
          canvasRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        className="w-full h-full overflow-auto relative bg-gray-50"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        {/* Connexions */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map(connection => (
            <Connection
              key={connection.id}
              source={connection.sourcePosition}
              target={connection.targetPosition!}
              selected={selectedModule === connection.sourceId || selectedModule === connection.targetId}
            />
          ))}
          {connectionStart && (
            <Connection
              key="temp-connection"
              source={connectionStart.position}
              target={mousePosition}
              selected={false}
              connecting={true}
            />
          )}
        </svg>

        {/* Modules */}
        {modules.map(module => (
          <Module
            key={module.id}
            module={module}
            selected={selectedModule === module.id}
            onMouseDown={(e) => {
              isDragging.current = true;
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                dragOffset.current = {
                  x: (e.clientX - rect.left) / zoom - module.position.x,
                  y: (e.clientY - rect.top) / zoom - module.position.y
                };
              }
            }}
            onDelete={() => onModuleDelete(module.id)}
            onConnect={(targetId) => {
              if (connectionStart) {
                onModuleConnect(connectionStart.id, targetId);
                setConnectionStart(null);
              }
            }}
            onStartConnection={(sourceId) => {
              setConnectionStart({
                id: sourceId,
                position: module.position
              });
            }}
            isValidTarget={!!connectionStart && connectionStart.id !== module.id}
          />
        ))}
      </div>
    );
  }
);

ConstructionCanvas.displayName = 'ConstructionCanvas';