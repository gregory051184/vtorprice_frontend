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

const correctEmail = (errorMessage = 'Email address should be correct') => (val: string) => {
    if (val === "") {
        return null;
    }
    const domenZoneList = [
        'ru', 'su', 'com', 'info', 'edu', 'gov', 'uk', 'org', 'de', 'net', 'kz', 'by', 'az', 'cn'
    ]
    const dogContains = val.split('@').length === 2
    const dotContains = val.split('@')[1].split('.').length >= 2
    //const inDomenZone = domenZoneList.includes(val.split('@')[1].split('.')[1])
    const inDomenZone = domenZoneList.includes(val.split('@')[1].split('.')[val.split('@')[1].split('.').length - 1])
    if (dogContains && inDomenZone && dotContains) {
        return null;
    }
    throw errorMessage;
};

const telephoneNumber = (errorMessage = 'Phone number should be correct') => (val: string) => {
    const reg = /^((\+7|7|8)+([0-9]){10})$/
    if (reg.test(val)) {
        return null;
    }
    throw errorMessage;
}

const maxPriceLimit = (errorMessage = 'Max price should not be over 300 rub/kg') => (val: string) => {
    const notOver = +val <= 300;
    if (notOver) {
        return null;
    }
    throw errorMessage;
}

const minLimit = (errorMessage = 'Min price should minimum 1 rub/kg') => (val: string) => {
    const equalOrOver = +val >= 1;
    if (equalOrOver) {
        return null;
    }
    throw errorMessage;
}

export {
    isNotEmptyString,
    isNotEmptyNumber,
    isNotNull,
    correctEmail,
    telephoneNumber,
    maxPriceLimit,
    minLimit
};
