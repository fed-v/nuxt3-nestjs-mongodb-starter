import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

type ValidationErrorDetail = {
  field: string;
  errors: string[];
};

function formatValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationErrorDetail[] {
  return errors.flatMap((error) => {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const currentErrors = Object.values(error.constraints ?? {});
    const childErrors = formatValidationErrors(error.children ?? [], field);

    if (currentErrors.length === 0) {
      return childErrors;
    }

    return [
      {
        field,
        errors: currentErrors,
      },
      ...childErrors,
    ];
  });
}

export function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) =>
      new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formatValidationErrors(errors),
      }),
  });
}
