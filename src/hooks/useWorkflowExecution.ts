import { create } from 'zustand';
import { Workflow } from '../types/workflow';
import { WorkflowValidation } from '../services/workflowValidation';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowExecutionStore {
  workflows: Workflow[];
  saveWorkflow: (workflowData: Partial<Workflow>) => { success: boolean; errors?: string[] };
  toggleWorkflowStatus: (id: string) => void;
  deleteWorkflow: (id: string) => void;
}

const workflowValidation = new WorkflowValidation();

export const useWorkflowExecution = create<WorkflowExecutionStore>((set, get) => ({
  workflows: [],
  
  saveWorkflow: (workflowData: Partial<Workflow>) => {
    const validation = workflowValidation.validateWorkflow(workflowData);
    
    if (!validation.isValid) {
      console.error('Validation du workflow échouée:', validation.errors);
      return { success: false, errors: validation.errors };
    }

    const workflow: Workflow = {
      id: uuidv4(),
      name: workflowData.name!,
      description: workflowData.description || '',
      status: 'inactive',
      modules: workflowData.modules || [],
      runs: 0,
      success: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set((state) => ({
      workflows: [...state.workflows, workflow]
    }));

    return { success: true };
  },

  toggleWorkflowStatus: (id: string) => {
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === id
          ? {
              ...workflow,
              status: workflow.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date().toISOString()
            }
          : workflow
      )
    }));
  },

  deleteWorkflow: (id: string) => {
    set((state) => ({
      workflows: state.workflows.filter((workflow) => workflow.id !== id)
    }));
  }
}));