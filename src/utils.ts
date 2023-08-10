import environment from './environment';
import { InternalServerErrorException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import fs = require('node:fs');

export function isError(value: unknown): value is Error {
    return is(value, Error);
}

export function is<T>(
    value: unknown,
    constructor: new (...args: any[]) => T,
): value is T {
    return value instanceof constructor;
}

export function handleIsInternalServerError(value: Error) {
    if (!is(value, InternalServerErrorException)) return;

    throw new InternalServerErrorException(
        'Something went wrong internally' +
            (environment.isDevelopment
                ? `: ${value.name} ${value.message}, ${
                      value.cause || 'Response'
                  }::${JSON.stringify(value.getResponse())}`
                : ''),
    );
}

export function throwErrorOrContinue<T>(
    value: T | Error,
): asserts value is Exclude<T, Error> {
    if (isError(value)) {
        handleIsInternalServerError(value);
        throw value;
    }
}

export class CriticalException extends HttpException {
    constructor(message: string) {
        super(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Critical Error: ' + message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

export function checkFileExists(filepath: string) {
    return new Promise((resolve) => {
        fs.access(filepath, fs.constants.F_OK, (err) => {
            resolve(!err);
        });
    });
}

export function deleteFile(filePath: string): Promise<null | Error> {
    return new Promise((res) => {
        fs.unlink(filePath, (err) => {
            err ? res(err) : res(null);
        });
    });
}

export function folderExists(folderPath: string) {
    try {
        fs.accessSync(folderPath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

export function createFolder(folderPath: string): Promise<null | Error> {
    return new Promise((res) => {
        try {
            fs.mkdirSync(folderPath);
            res(null);
        } catch (err) {
            res(err);
        }
    });
}
