import OpenAI from 'openai';
import { ChartConfig } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface AnalysisContext {
  category: 'finance' | 'marketing' | 'sales';
}

// Fonction pour réduire intelligemment les données
function reduceDataset(data: any[]): any[] {
  // Si les données sont déjà petites, les retourner telles quelles
  if (data.length <= 20) return data;

  // Calculer l'intervalle d'échantillonnage
  const interval = Math.ceil(data.length / 20);
  
  // Sélectionner des points représentatifs
  return data.filter((_, index) => index % interval === 0);
}

// Fonction pour nettoyer et formater une valeur
function cleanValue(value: any): any {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Nettoyer les valeurs monétaires
    const numericValue = value.replace(/[^0-9.-]/g, '');
    if (!isNaN(Number(numericValue))) {
      return Number(numericValue);
    }
    // Tronquer les longues chaînes
    return value.length > 50 ? value.substring(0, 50) + '...' : value;
  }
  return null;
}

// Fonction pour préparer les données pour l'analyse
function prepareDataForAnalysis(data: any[]): any[] {
  // Réduire le jeu de données
  const reducedData = reduceDataset(data);

  // Nettoyer chaque entrée
  return reducedData.map(item => {
    const cleanedItem: Record<string, any> = {};
    Object.entries(item).forEach(([key, value]) => {
      cleanedItem[key] = cleanValue(value);
    });
    return cleanedItem;
  });
}

export async function analyzeData(
  data: any[],
  question: string,
  context: AnalysisContext
): Promise<{
  answer: string;
  chartConfig?: ChartConfig;
}> {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Données invalides pour l\'analyse');
    }

    // Préparer les données
    const preparedData = prepareDataForAnalysis(data);
    const columns = Object.keys(preparedData[0]);
    const dataPreview = preparedData.slice(0, 3);

    // Créer un prompt concis
    const systemPrompt = `Analysez ces données ${context.category} (colonnes: ${columns.join(', ')}). 
    Aperçu: ${JSON.stringify(dataPreview)}. 
    Répondez brièvement et suggérez une visualisation pertinente.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      functions: [{
        name: "suggest_visualization",
        parameters: {
          type: "object",
          properties: {
            chartConfig: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["bar", "line", "pie"] },
                title: { type: "string" },
                xAxis: { type: "string" },
                yAxis: { type: "string" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      value: { type: "number" }
                    }
                  }
                }
              },
              required: ["type", "title", "data"]
            }
          }
        }
      }],
      function_call: "auto",
      max_tokens: 150
    });

    const answer = response.choices[0].message?.content || "Analyse effectuée.";
    let chartConfig: ChartConfig | undefined;

    if (response.choices[0].message?.function_call) {
      try {
        const functionArgs = JSON.parse(response.choices[0].message.function_call.arguments);
        chartConfig = functionArgs.chartConfig;
      } catch (error) {
        console.error('Erreur lors du parsing de la configuration du graphique:', error);
      }
    }

    return { answer, chartConfig };
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    if (error.error?.code === 'context_length_exceeded') {
      throw new Error('Volume de données trop important. Analyse effectuée sur un échantillon représentatif.');
    }
    throw new Error('Erreur lors de l\'analyse des données');
  }
}