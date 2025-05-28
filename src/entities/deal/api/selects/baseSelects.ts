import { ISelectValue, ITabSelectValue } from '@box/shared/ui';

export const dealStatusSelectValues: Array<ISelectValue<number>> = [
  {
    id: 1,
    label: 'Согласование условий',
    value: 1,
  },
  {
    id: 2,
    label: 'Назначение логиста',
    value: 2,
  },
  {
    id: 3,
    label: 'Машина загружена',
    value: 3,
  },
  {
    id: 4,
    label: 'Машина выгружена',
    value: 4,
  },
  {
    id: 5,
    label: 'Окончательная приемка',
    value: 5,
  },
  {
    id: 6,
    label: 'Сделка закрыта',
    value: 6,
  },
  {
    id: 7,
    label: 'Проблемная сделка',
    value: 7,
  },
  {
    id: 8,
    label: 'Сделка отменена',
    value: 8,
  },
];

export const dealPaymentTerms: Array<ISelectValue<number>> = [
  {
    id: 1,
    label: 'По факту погрузки',
    value: 1
  },
  {
    id: 2,
    label: 'По факту выгрузки',
    value: 2
  },
  {
    id: 3,
    label: 'Другое',
    value: 3
  },
];

export const dealDelivery: Array<ITabSelectValue<number>> = [
  {
    id: 1,
    label: 'Поставщик',
    value: 1
  },
  {
    id: 2,
    label: 'Покупатель',
    value: 2
  },
  {
    id: 3,
    label: 'ВторПрайс',
    value: 3
  },
];
