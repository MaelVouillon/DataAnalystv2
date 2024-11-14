import { utils, WorkBook } from 'xlsx';

interface Table {
  name: string;
  columns: string[];
  data: any[];
  startRow: number;
  startCol: number;
}

interface Sheet {
  name: string;
  tables: Table[];
}

const isEmptyRow = (row: any[]): boolean => {
  return !row || row.every(cell => cell === null || cell === undefined || cell === '');
};

const isEmptyColumn = (data: any[][], colIndex: number): boolean => {
  return data.every(row => !row[colIndex] || row[colIndex] === '');
};

const findTables = (sheetData: any[][]): Table[] => {
  const tables: Table[] = [];
  let currentRow = 0;

  while (currentRow < sheetData.length) {
    // Ignorer les lignes vides au début
    while (currentRow < sheetData.length && isEmptyRow(sheetData[currentRow])) {
      currentRow++;
    }

    if (currentRow >= sheetData.length) break;

    // Trouver le début du tableau
    const startRow = currentRow;
    let endRow = startRow;
    let startCol = 0;
    let endCol = sheetData[startRow].length - 1;

    // Trouver la fin du tableau (première ligne vide après le début)
    while (endRow < sheetData.length && !isEmptyRow(sheetData[endRow])) {
      endRow++;
    }

    // Trouver les colonnes non vides
    while (startCol <= endCol && isEmptyColumn(sheetData.slice(startRow, endRow), startCol)) {
      startCol++;
    }
    while (endCol >= startCol && isEmptyColumn(sheetData.slice(startRow, endRow), endCol)) {
      endCol--;
    }

    // Extraire les données du tableau
    if (endRow > startRow && endCol >= startCol) {
      const tableData = sheetData
        .slice(startRow, endRow)
        .map(row => row.slice(startCol, endCol + 1));

      // Extraire les en-têtes (première ligne)
      const headers = tableData[0].map((header: any) => String(header || '').trim());

      // Créer les objets de données avec les en-têtes comme clés
      const data = tableData.slice(1).map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      tables.push({
        name: `Tableau ${tables.length + 1}`,
        columns: headers,
        data,
        startRow,
        startCol
      });
    }

    currentRow = endRow + 1;
  }

  return tables;
};

export const processExcelSheets = (workbook: WorkBook): Sheet[] => {
  if (!workbook || !workbook.SheetNames || !workbook.Sheets) {
    return [];
  }

  return workbook.SheetNames.map(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = utils.sheet_to_json(worksheet, { 
      header: 1, 
      defval: null,
      blankrows: false
    });

    return {
      name: sheetName,
      tables: findTables(rawData)
    };
  }).filter(sheet => sheet.tables.length > 0); // Ne garder que les feuilles avec des données
};