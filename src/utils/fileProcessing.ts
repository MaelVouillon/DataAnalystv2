import Papa from 'papaparse';
import { read, utils, WorkBook } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { DataSet } from '../types';

export async function processFile(file: File): Promise<DataSet> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (!fileType) {
    throw new Error('Type de fichier non reconnu');
  }

  try {
    if (fileType === 'csv') {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && Array.isArray(results.data)) {
              const filteredData = results.data.filter((row: any) =>
                Object.values(row).some(value => value !== '')
              );

              resolve({
                id: uuidv4(),
                name: file.name,
                type: 'csv',
                data: filteredData,
                uploadedAt: Date.now(),
              });
            } else {
              reject(new Error('Structure CSV invalide'));
            }
          },
          error: (error) => {
            reject(new Error(`Erreur CSV: ${error.message}`));
          },
        });
      });
    }

    if (fileType === 'xlsx' || fileType === 'xls') {
      const data = await file.arrayBuffer();
      const workbook = read(data, { type: 'array' });

      if (!workbook.SheetNames.length) {
        throw new Error('Aucune feuille trouvée dans le fichier Excel');
      }

      // Créer un objet avec toutes les feuilles
      const sheets: { [key: string]: any[] } = {};
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(sheet, {
          header: 1,
          defval: null,
          blankrows: false
        });
        if (jsonData.length > 0) {
          sheets[sheetName] = jsonData;
        }
      });

      return {
        id: uuidv4(),
        name: file.name,
        type: 'excel',
        data: workbook, // Garder le workbook complet
        sheets, // Ajouter les données traitées des feuilles
        uploadedAt: Date.now(),
      };
    }

    if (fileType === 'json') {
      const text = await file.text();
      try {
        const jsonData = JSON.parse(text);
        const processedData = Array.isArray(jsonData) ? jsonData : [jsonData];

        return {
          id: uuidv4(),
          name: file.name,
          type: 'json',
          data: processedData,
          uploadedAt: Date.now(),
        };
      } catch (error) {
        throw new Error('Format JSON invalide');
      }
    }

    throw new Error('Format de fichier non supporté');
  } catch (error) {
    console.error('Erreur de traitement:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur lors du traitement du fichier');
  }
}