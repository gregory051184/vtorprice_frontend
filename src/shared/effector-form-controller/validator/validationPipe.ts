import { ValidationRule } from './types';

export const validationPipe = (value: any, ...rules: Array<ValidationRule>) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const rule of rules) {
      rule(value);
    }
    return null;
  } catch (firstError) {
    let message = '';
    if (typeof firstError === 'string') {
      message = firstError;
    }
    return {
      message,
    };
  }
};
