import { Workflow, WorkflowExecution } from '../types/workflow';
import { useWorkflowStore } from '../hooks/useWorkflowStore';

class WorkflowEngine {
  private static instance: WorkflowEngine;
  private activeWorkflows: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    // Singleton
  }

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  public startWorkflow(workflow: Workflow): void {
    if (workflow.status !== 'active') return;

    // Stop existing interval if any
    this.stopWorkflow(workflow.id);

    // Start new interval
    const interval = setInterval(() => {
      this.executeWorkflow(workflow);
    }, 60000); // Check every minute

    this.activeWorkflows.set(workflow.id, interval);
  }

  public stopWorkflow(workflowId: string): void {
    const interval = this.activeWorkflows.get(workflowId);
    if (interval) {
      clearInterval(interval);
      this.activeWorkflows.delete(workflowId);
    }
  }

  private async executeWorkflow(workflow: Workflow): Promise<void> {
    const store = useWorkflowStore.getState();
    const startTime = Date.now();

    try {
      // Simulate workflow execution
      await this.simulateExecution(workflow);

      // Log successful execution
      store.addExecution({
        workflowId: workflow.id,
        workflow: workflow.name,
        status: 'success',
        duration: `${(Date.now() - startTime) / 1000}s`,
        details: 'Exécution réussie',
      });
    } catch (error) {
      // Log failed execution
      store.addExecution({
        workflowId: workflow.id,
        workflow: workflow.name,
        status: 'error',
        duration: `${(Date.now() - startTime) / 1000}s`,
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  private async simulateExecution(workflow: Workflow): Promise<void> {
    // Simulate API calls and processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Randomly fail some executions for demonstration
    if (Math.random() < 0.1) {
      throw new Error('Échec aléatoire pour démonstration');
    }
  }
}

export const workflowEngine = WorkflowEngine.getInstance();