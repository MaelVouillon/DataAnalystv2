import { Workflow, WorkflowModule } from '../types/workflow';

export class WorkflowValidation {
  validateWorkflow(workflow: Partial<Workflow>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation du nom
    if (!workflow.name?.trim()) {
      errors.push('Le nom du workflow est requis');
      return { isValid: false, errors };
    }

    // Validation des modules
    if (!workflow.modules || workflow.modules.length === 0) {
      errors.push('Au moins un module est requis');
      return { isValid: false, errors };
    }

    // Vérifier qu'il y a exactement un déclencheur
    const triggers = workflow.modules.filter(m => m.type === 'trigger');
    if (triggers.length === 0) {
      errors.push('Un déclencheur est requis');
    } else if (triggers.length > 1) {
      errors.push('Un seul déclencheur est autorisé');
    }

    // Vérifier les connexions
    const connectionErrors = this.validateConnections(workflow.modules);
    errors.push(...connectionErrors);

    // Vérifier la configuration des modules
    const configErrors = this.validateModuleConfigs(workflow.modules || []);
    errors.push(...configErrors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateConnections(modules: WorkflowModule[] = []): string[] {
    const errors: string[] = [];
    const connected = new Set<string>();

    // Vérifier les connexions de chaque module
    modules.forEach(module => {
      // Ajouter les modules cibles aux modules connectés
      module.connections.forEach(targetId => {
        if (!modules.find(m => m.id === targetId)) {
          errors.push(`Le module "${module.name}" est connecté à un module inexistant`);
        }
        connected.add(targetId);
      });

      // Vérifier les connexions cycliques
      if (this.hasCyclicConnections(module.id, modules, new Set())) {
        errors.push(`Boucle infinie détectée à partir du module "${module.name}"`);
      }
    });

    // Vérifier les modules non connectés (sauf le déclencheur)
    modules.forEach(module => {
      if (module.type !== 'trigger' && !connected.has(module.id)) {
        errors.push(`Le module "${module.name}" n'est pas connecté`);
      }
    });

    return errors;
  }

  private hasCyclicConnections(
    currentId: string,
    modules: WorkflowModule[],
    visited: Set<string>
  ): boolean {
    if (visited.has(currentId)) {
      return true;
    }

    visited.add(currentId);
    const currentModule = modules.find(m => m.id === currentId);
    
    if (!currentModule) {
      return false;
    }

    for (const targetId of currentModule.connections) {
      if (this.hasCyclicConnections(targetId, modules, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  private validateModuleConfigs(modules: WorkflowModule[]): string[] {
    const errors: string[] = [];

    modules.forEach(module => {
      if (!module.config) {
        errors.push(`Le module "${module.name}" n'a pas de configuration`);
        return;
      }

      switch (module.type) {
        case 'trigger':
          if (!module.config.event) {
            errors.push(`Le déclencheur "${module.name}" doit avoir un événement configuré`);
          }
          break;

        case 'action':
          if (!module.config.action) {
            errors.push(`L'action "${module.name}" doit avoir une action configurée`);
          }
          break;

        case 'condition':
          if (!module.config.condition) {
            errors.push(`La condition "${module.name}" doit avoir une condition configurée`);
          }
          break;

        case 'loop':
          if (!module.config.iterator) {
            errors.push(`La boucle "${module.name}" doit avoir un itérateur configuré`);
          }
          break;
      }
    });

    return errors;
  }
}