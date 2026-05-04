import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AppError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError
} from '../../src/domain/errors.js';

test('error classes expose consistent metadata', () => {
  const errors = [
    new AppError('boom', 500, 'APP_ERROR'),
    new ValidationError('invalid'),
    new NotFoundError('missing'),
    new ConflictError('conflict'),
    new AuthorizationError('forbidden')
  ];

  assert.deepEqual(errors.map((error) => error.name), [
    'AppError',
    'ValidationError',
    'NotFoundError',
    'ConflictError',
    'AuthorizationError'
  ]);
  assert.deepEqual(errors.map((error) => error.statusCode), [500, 400, 404, 409, 403]);
  assert.deepEqual(errors.map((error) => error.code), [
    'APP_ERROR',
    'VALIDATION_ERROR',
    'NOT_FOUND',
    'CONFLICT',
    'FORBIDDEN'
  ]);
  assert.deepEqual(errors.map((error) => error.message), [
    'boom',
    'invalid',
    'missing',
    'conflict',
    'forbidden'
  ]);
});
