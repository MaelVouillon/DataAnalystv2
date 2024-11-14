import { WorkflowTemplate } from '../types/workflow';

export const defaultTemplates: WorkflowTemplate[] = [
  {
    id: 'linkedin-auto-response',
    name: 'Réponse Automatique LinkedIn',
    description: 'Répond automatiquement aux nouvelles connexions LinkedIn avec un message personnalisé',
    category: 'Networking',
    popularity: 'Populaire',
    complexity: 'Facile',
    workflow: {
      name: 'Réponse Automatique LinkedIn',
      description: 'Répond automatiquement aux nouvelles connexions LinkedIn',
      trigger: {
        type: 'linkedin',
        config: {
          event: 'new_connection'
        }
      },
      action: {
        type: 'send-message',
        config: {
          template: 'Merci pour la connexion ! Je suis ravi(e) de vous avoir dans mon réseau.'
        }
      },
      filters: []
    }
  },
  {
    id: 'instagram-excel-post',
    name: 'Publication Sociale depuis Excel',
    description: 'Publie automatiquement sur Instagram le contenu listé dans un fichier Excel',
    category: 'Marketing',
    popularity: 'Tendance',
    complexity: 'Moyen',
    workflow: {
      name: 'Publication Instagram depuis Excel',
      description: 'Publie le contenu Excel sur Instagram',
      trigger: {
        type: 'excel',
        config: {
          file: 'posts.xlsx',
          sheet: 'Publications'
        }
      },
      action: {
        type: 'create-post',
        config: {
          platform: 'instagram'
        }
      },
      filters: [
        {
          id: '1',
          field: 'status',
          operator: 'equals',
          value: 'ready'
        }
      ]
    }
  }
];