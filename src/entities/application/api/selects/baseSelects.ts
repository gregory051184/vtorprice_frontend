import {ITabSelectValue} from '@box/shared/ui';

export const dealTypeSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Покупка',
        value: 1,
    },
    {
        id: 2,
        label: 'Продажа',
        value: 2,
    },
];


export const urgencyTypeSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Готово к отгрузке',
        value: 1
    },
    {
        id: 2,
        label: 'Контракт на поставку',
        value: 2
    },
];

export const applicationStatusSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'На проверка',
        value: 1,
    },
    {
        id: 2,
        label: 'Опубликована',
        value: 2,
    },
    {
        id: 3,
        label: 'Завершена',
        value: 3,
    },
    {
        id: 4,
        label: 'Отклонена',
        value: 4,
    },
];

export const packingSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Входит в стоимость',
        value: 1,
    },
    {
        id: 2,
        label: 'Вычитается',
        value: 2,
    },
];

export const packingTaxSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'На упаковку с каждой кипы',
        value: 1,
    },
    {
        id: 2,
        label: 'На упаковку с общего веса',
        value: 2,
    },
];

export const wasInUseSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Новое',
        value: 0
    },
    {
        id: 2,
        label: 'Б/У',
        value: 1
    },
];
export const applicationTypes: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Оборудование',
        value: 1
    },
    {
        id: 2,
        label: 'Вторсырье',
        value: 2
    }
];

export const TimeframeTypes: Array<ITabSelectValue<string>> = [
    {
        id: 1,
        label: 'Неделя',
        value: 'week'
    },
    {
        id: 2,
        label: 'Месяц',
        value: 'month'
    },
    {
        id: 3,
        label: 'Год',
        value: 'year'
    },
    {
        id: 4,
        label: 'Все время',
        value: 'all'
    }
];

export const ndsTaxSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Без НДС',
        value: 0,
    },
    {
        id: 2,
        label: 'С НДС',
        value: 1
    },
];

export const applicationStatusForUsersSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 2,
        label: 'Опубликована',
        value: 2,
    },
    {
        id: 3,
        label: 'Завершена',
        value: 3,
    }
];

export const yesOrNo: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Нет',
        value: 1,
    },
    {
        id: 2,
        label: 'Да',
        value: 2,
    },
    {
        id: 3,
        label: 'Не обязательно',
        value: 3,
    },
];

export const isCompanyIsJurOrIp: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Юр. лицо',
        value: 1,
    },
    {
        id: 2,
        label: 'ИП',
        value: 2,
    },
    {
        id: 3,
        label: 'Не обязательно',
        value: 3,
    },

];

export const companyRatingSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 7,
        label: '5',
        value: 5,
    },
    {
        id: 8,
        label: '4 и выше',
        value: 4,
    },
    {
        id: 9,
        label: '3 и выше',
        value: 3,
    },
    {
        id: 10,
        label: 'Любой',
        value: 0,
    },
]

export const companyActivityTypesSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Поставщик',
        value: 1
    },
    {
        id: 2,
        label: 'Переработчик',
        value: 2
    },
    {
        id: 3,
        label: 'Покупатель',
        value: 3
    },
]

export const applicationRecyclableStatusSelectValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Отходы',
        value: 1
    },
    {
        id: 2,
        label: 'Гранула',
        value: 2
    },
];

export const appRecStatusSelectSellBuyValues: Array<ITabSelectValue<number>> = [
    {
        id: 1,
        label: 'Отходы покупка',
        value: 1
    },
    {
        id: 2,
        label: 'Гранула покупка',
        value: 2
    },
    {
        id: 3,
        label: 'Отходы продажа',
        value: 3
    },
    {
        id: 4,
        label: 'Гранула продажа',
        value: 4
    },
];





