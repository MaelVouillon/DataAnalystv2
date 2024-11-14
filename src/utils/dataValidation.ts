import { ColumnMapping, ValidationError } from '../types/mapping';

export const validateData = (
  data: any[],
  mapping: ColumnMapping[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  data.forEach((row, rowIndex) => {
    mapping.forEach((column) => {
      const value = row[column.name];

      switch (column.type) {
        case 'number':
          if (isNaN(Number(value))) {
            errors.push({
              row: rowIndex,
              column: column.name,
              value,
              message: 'La valeur doit être un nombre',
            });
          }
          break;

        case 'date':
          if (isNaN(Date.parse(value))) {
            errors.push({
              row: rowIndex,
              column: column.name,
              value,
              message: 'Format de date invalide',
            });
          }
          break;

        case 'boolean':
          if (!['true', 'false', '0', '1'].includes(String(value).toLowerCase())) {
            errors.push({
              row: rowIndex,
              column: column.name,
              value,
              message: 'La valeur doit être un booléen',
            });
          }
          break;

        case 'currency':
          if (isNaN(Number(value.replace(/[€$,]/g, '')))) {
            errors.push({
              row: rowIndex,
              column: column.name,
              value,
              message: 'Format de devise invalide',
            });
          }
          break;
      }
    });
  });

  return errors;
};