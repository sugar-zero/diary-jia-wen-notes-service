import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'notEmpty', async: false })
export class NotEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const files = args.object['files'];
    const content = args.object['content'];

    return (
      (files !== null && files !== undefined && files !== '') ||
      (content !== null && content !== undefined && content !== '')
    );
  }

  defaultMessage(args: ValidationArguments) {
    const propertyName = args.property;
    return `${propertyName} should not be empty.`;
  }
}

export function NotEmpty() {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'At least one of files or content should not be empty.',
      },
      constraints: [],
      validator: NotEmptyConstraint,
    });
  };
}
