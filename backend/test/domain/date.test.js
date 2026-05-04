import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInclusiveDays, formatDateKey, toUtcDate } from '../../src/domain/date.js';

test('toUtcDate normalizes input dates', () => {
  const fromDate = toUtcDate(new Date('2026-05-04T15:40:00.000Z'), 'startDate');
  const fromString = toUtcDate('2026-05-05T12:30:00.000Z', 'startDate');

  assert.equal(fromDate.toISOString(), '2026-05-04T00:00:00.000Z');
  assert.equal(fromString.toISOString(), '2026-05-05T00:00:00.000Z');
});

test('toUtcDate rejects invalid input', () => {
  assert.throws(() => toUtcDate('not-a-date', 'startDate'), /startDate must be a valid date/);
});

test('formatDateKey returns yyyy-mm-dd', () => {
  assert.equal(formatDateKey('2026-05-04T10:30:00.000Z'), '2026-05-04');
});

test('calculateInclusiveDays counts full day ranges', () => {
  assert.equal(calculateInclusiveDays('2026-05-04', '2026-05-04'), 1);
  assert.equal(calculateInclusiveDays('2026-05-04', '2026-05-06'), 3);
});

test('calculateInclusiveDays rejects inverted ranges', () => {
  assert.throws(
    () => calculateInclusiveDays('2026-05-06', '2026-05-04'),
    /endDate must be on or after startDate/
  );
});
