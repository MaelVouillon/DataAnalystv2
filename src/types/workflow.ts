export interface Position {
  x: number;
  y: number;
}

export interface WorkflowModule {
  id: string;
  type: string;
  name: string;
  position: Position;
  config: Record<string, any>;
  connections: string[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: string;
  complexity: string;
  workflow: {
    name: string;
    description: string;
    trigger: {
      type: string;
      config: Record<string, any>;
    };
    action: {
      type: string;
      config: Record<string, any>;
    };
    filters: any[];
  };
}

export type WorkflowStatus = 'active' | 'inactive' | 'error';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  modules: WorkflowModule[];
  lastRun?: string;
  runs: number;
  success: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflow: string;
  status: 'success' | 'error' | 'pending';
  duration: string;
  details: string;
  timestamp: string;
}