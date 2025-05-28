const isNotEmptyString = (errorMessage = 'Field should not be empty') => (val: string) => {
  if (val.trim().length > 0) {
    return null;
  }
  throw errorMessage;
};

const isNotEmptyNumber = (errorMessage = 'Field should not be empty') => (val: string) => {
  if (!!val) {
    return null;
  }
  throw errorMessage;
};

const isNotNull = (errorMessage = 'Field should not be empty') => (val: any) => {
  if (val !== null) {
    return null;
  }
  throw errorMessage;
};

export {
  isNotEmptyString,
  isNotEmptyNumber,
  isNotNull,
};
