import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Workflow, WorkflowExecution, WorkflowTemplate } from '../types/workflow';

interface WorkflowStore {
  workflows: Workflow[];
  executions: WorkflowExecution[];
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'status' | 'runs' | 'success' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  toggleWorkflowStatus: (id: string) => void;
  addExecution: (execution: Omit<WorkflowExecution, 'id' | 'timestamp'>) => void;
  getWorkflow: (id: string) => Workflow | undefined;
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      workflows: [],
      executions: [],

      addWorkflow: (workflow) =>
        set((state) => ({
          workflows: [
            ...state.workflows,
            {
              ...workflow,
              id: uuidv4(),
              status: 'inactive',
              runs: 0,
              success: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateWorkflow: (id, workflow) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  ...workflow,
                  updatedAt: new Date().toISOString(),
                }
              : w
          ),
        })),

      deleteWorkflow: (id) =>
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
        })),

      toggleWorkflowStatus: (id) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  status: w.status === 'active' ? 'inactive' : 'active',
                  updatedAt: new Date().toISOString(),
                }
              : w
          ),
        })),

      addExecution: (execution) =>
        set((state) => {
          const workflow = get().workflows.find((w) => w.id === execution.workflowId);
          if (workflow) {
            get().updateWorkflow(workflow.id, {
              runs: workflow.runs + 1,
              success: execution.status === 'success' ? workflow.success + 1 : workflow.success,
              lastRun: new Date().toISOString(),
            });
          }

          return {
            executions: [
              {
                ...execution,
                id: uuidv4(),
                timestamp: new Date().toISOString(),
              },
              ...state.executions,
            ].slice(0, 100), // Keep only last 100 executions
          };
        }),

      getWorkflow: (id) => get().workflows.find((w) => w.id === id),
    }),
    {
      name: 'workflow-storage',
    }
  )
);