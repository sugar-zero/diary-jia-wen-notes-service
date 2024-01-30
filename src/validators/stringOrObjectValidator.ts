import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'notEmpty', async: false })
export class IsStringOrObjectConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    return (
      typeof value === 'string' || (typeof value === 'object' && value !== null)
    );
  }

  defaultMessage(args: ValidationArguments) {
    const propertyName = args.property;
    return `${propertyName} 必须为文本或对象.`;
  }
}

export function IsStringOrObject() {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: '至少有一个内容不为空.',
      },
      constraints: [],
      validator: IsStringOrObjectConstraint,
    });
  };
}
