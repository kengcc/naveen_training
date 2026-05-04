import { ValidationError } from './errors.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toUtcDate(value, fieldName) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`);
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatDateKey(value, fieldName = 'date') {
  return toUtcDate(value, fieldName).toISOString().slice(0, 10);
}

export function calculateInclusiveDays(startDate, endDate) {
  const start = toUtcDate(startDate, 'startDate');
  const end = toUtcDate(endDate, 'endDate');

  if (end < start) {
    throw new ValidationError('endDate must be on or after startDate');
  }

  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}
