import React from 'react';
import { Position } from '../../../types/workflow';

interface ConnectionProps {
  source: Position;
  target: Position;
  selected: boolean;
  animated?: boolean;
  connecting?: boolean;
}

export const Connection: React.FC<ConnectionProps> = ({ 
  source, 
  target, 
  selected,
  animated = false,
  connecting = false
}) => {
  // Calculate control points for a smooth curve
  const midX = source.x + (target.x - source.x) / 2;
  
  const path = `
    M ${source.x} ${source.y}
    C ${midX} ${source.y},
      ${midX} ${target.y},
      ${target.x} ${target.y}
  `;

  return (
    <>
      {/* Ligne d'effet lumineux */}
      <path
        d={path}
        stroke={selected ? '#818CF8' : connecting ? '#22C55E' : '#CBD5E1'}
        strokeWidth={6}
        strokeLinecap="round"
        strokeOpacity={0.2}
        fill="none"
      />
      
      {/* Ligne principale */}
      <path
        d={path}
        stroke={selected ? '#6366F1' : connecting ? '#16A34A' : '#94A3B8'}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        className={`transition-colors ${animated ? 'animate-pulse' : ''}`}
        strokeDasharray={connecting ? '5,5' : 'none'}
      />

      {/* Points de début et de fin */}
      <circle
        cx={source.x}
        cy={source.y}
        r={3}
        fill={selected ? '#6366F1' : connecting ? '#16A34A' : '#94A3B8'}
        className="transition-colors"
      />
      <circle
        cx={target.x}
        cy={target.y}
        r={3}
        fill={selected ? '#6366F1' : connecting ? '#16A34A' : '#94A3B8'}
        className="transition-colors"
      />
    </>
  );
};