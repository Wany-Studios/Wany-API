import environment from "./environment";
import { InternalServerErrorException } from "@nestjs/common";
import { HttpException, HttpStatus } from '@nestjs/common';

export function isError(value: unknown): value is Error {
    return is(value, Error);
}

export function is<T>(value: unknown, constructor: new (...args: any[]) => T): value is T {
    return value instanceof constructor;
}

export function handleIsInternalServerError(value: Error) {
    if (is(value, InternalServerErrorException)) {
        throw new InternalServerErrorException(
            'Something went wrong internally' + (
                environment.isDevelopment ?
                    `: ${value.name} ${value.message}, ${value.cause || 'Response'}::${JSON.stringify(value.getResponse())}`
                    : ""
            )
        );
    }
}

export function throwIfIsError(value: unknown) {
    if (isError(value)) throw value;
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
