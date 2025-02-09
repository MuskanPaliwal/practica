import sinon from 'sinon';
import { Server } from 'http';
import { logger } from '@practica/logger';
import { AppError, errorHandler } from '../error-handling';

beforeEach(() => {
  sinon.restore();
});

describe('handleError', () => {
  test('When uncaughtException emitted, error handled should catch and handle the error properly', () => {
    // Arrange
    const httpServerMock = { close: () => {} } as Server;
    const loggerStub = sinon.stub(logger, 'error');
    errorHandler.listenToErrorEvents(httpServerMock);
    const errorName = 'mocking an uncaught exception';
    const errorToEmit = new Error(errorName);
    // Act
    process.emit('uncaughtException', errorToEmit);
    // Assert
    const relevantArguments = loggerStub.firstCall.args[0];
    expect(loggerStub.callCount).toBe(1);
    expect(relevantArguments instanceof AppError).toBe(true);
    expect(relevantArguments).toMatchObject({
      name: errorToEmit.name,
      message: errorToEmit.message,
      stack: expect.any(String),
    });
  });

  test('When handling an Error instance, should log an AppError instance after receiving an Error instance', () => {
    // Arrange
    const errorToHandle = new Error('mocking pre-known error');
    const stdoutSpy = jest.spyOn(process.stdout, 'write');

    // Act
    errorHandler.handleError(errorToHandle);

    // Assert
    expect(stdoutSpy).toHaveBeenCalled();
  });

  test('When handling AppError, then all the important properties are passed to the logger', () => {
    // Arrange
    const errorToHandle = new AppError(
      'invalid-input',
      'missing important field',
      400,
      true
    );
    const loggerListener = sinon.stub(logger, 'error');

    // Act
    errorHandler.handleError(errorToHandle);

    // Assert
    expect({ loggerCalls: 1 }).toMatchObject({
      loggerCalls: loggerListener.callCount,
    });
    expect(loggerListener.lastCall.firstArg).toMatchObject({
      name: 'invalid-input',
      HTTPStatus: 400,
      message: 'missing important field',
      isTrusted: true,
      stack: expect.any(String),
    });
  });

  test.each([
    1,
    'oops, this error is actually a string!',
    null,
    Infinity,
    false,
    { someKey: 'someValue' },
    [],
    undefined,
    NaN,
    '🐥',
    () => {},
  ])(
    'When handling an Error instance, should log an AppError instance after receiving unknown error of multiple types',
    (unknownErrorValue) => {
      // Arrange
      const loggerStub = sinon.stub(logger, 'error');
      // Act
      errorHandler.handleError(unknownErrorValue);
      // Assert
      const relevantArguments = loggerStub.firstCall.args[0];
      expect(loggerStub.callCount).toBe(1);
      expect(relevantArguments instanceof AppError).toBe(true);
      expect(relevantArguments.name).toBe('general-error');
      expect(relevantArguments.message.includes(typeof unknownErrorValue)).toBe(
        true
      );
    }
  );
});
