import React, { useEffect, useRef } from 'react';
import { WorkflowModule } from '../../../types/workflow';

interface MiniMapProps {
  modules: WorkflowModule[];
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  onPositionChange: (x: number, y: number) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  modules,
  canvasRef,
  zoom,
  onPositionChange
}) => {
  const miniMapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const miniMap = miniMapRef.current;
    if (!miniMap) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      updatePosition(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const updatePosition = (e: MouseEvent) => {
      const rect = miniMap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      if (canvasRef.current) {
        const scrollWidth = canvasRef.current.scrollWidth * zoom;
        const scrollHeight = canvasRef.current.scrollHeight * zoom;
        onPositionChange(x * scrollWidth, y * scrollHeight);
      }
    };

    miniMap.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      miniMap.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, zoom, onPositionChange]);

  // Calculate viewport position
  const getViewportStyle = () => {
    if (!canvasRef.current) return {};

    const { scrollLeft, scrollTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = canvasRef.current;

    return {
      left: `${(scrollLeft / scrollWidth) * 100}%`,
      top: `${(scrollTop / scrollHeight) * 100}%`,
      width: `${(clientWidth / scrollWidth) * 100}%`,
      height: `${(clientHeight / scrollHeight) * 100}%`
    };
  };

  return (
    <div
      ref={miniMapRef}
      className="w-48 h-32 bg-white rounded-lg shadow-lg p-2 cursor-move"
    >
      <div className="relative w-full h-full bg-gray-100 rounded">
        {/* Modules */}
        {modules.map(module => (
          <div
            key={module.id}
            className="absolute w-2 h-2 bg-indigo-500 rounded-sm transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(module.position.x / (canvasRef.current?.scrollWidth || 1)) * 100}%`,
              top: `${(module.position.y / (canvasRef.current?.scrollHeight || 1)) * 100}%`
            }}
          />
        ))}

        {/* Viewport */}
        <div
          className="absolute border-2 border-indigo-500 rounded bg-indigo-100 bg-opacity-20"
          style={getViewportStyle()}
        />
      </div>
    </div>
  );
};