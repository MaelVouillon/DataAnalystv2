import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const mockHistory = [
  {
    id: '1',
    workflow: 'Réponse Automatique LinkedIn',
    status: 'success',
    timestamp: '2024-02-20T10:30:00',
    duration: '2s',
    details: 'Message envoyé avec succès',
  },
  {
    id: '2',
    workflow: 'Publication Instagram depuis Excel',
    status: 'error',
    timestamp: '2024-02-20T10:15:00',
    duration: '5s',
    details: 'Erreur d\'authentification Instagram',
  },
  {
    id: '3',
    workflow: 'Génération de Contenu Marketing',
    status: 'pending',
    timestamp: '2024-02-20T10:00:00',
    duration: '8s',
    details: 'En attente de la réponse OpenAI',
  },
];

export const WorkflowHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Historique des Exécutions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {item.status === 'error' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {item.status === 'pending' && (
                      <Clock className="h-5 w-5 text-amber-500 animate-spin" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.workflow}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{item.duration}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{item.details}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div>Affichage de {mockHistory.length} résultats</div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                Précédent
              </button>
              <span>Page 1 sur 1</span>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};