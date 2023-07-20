import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "removeExtraSpaces", async: false })
export class RemoveExtraSpacesConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean {
        if (!value || typeof value !== "string") {
            return true;
        }

        const newValue = value.replace(/\s{2,}/g, " "); // Replace more than one consecutive space with a single space

        // Update the property value with the sanitized one
        (args.object as any)[args.property] = newValue;

        return true;
    }

    defaultMessage(args: ValidationArguments): string {
        return `"${args.property}" contains more than one space between words.`;
    }
}

export function RemoveExtraSpaces(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "removeExtraSpaces",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: RemoveExtraSpacesConstraint,
        });
    };
}
