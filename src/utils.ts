import { InternalServerErrorException } from "@nestjs/common";
import environment from "./environment";

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
