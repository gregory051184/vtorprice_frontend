import { ITabSelectValue } from "@box/shared/ui";

export const userRoleValues: Array<ITabSelectValue<number>> = [
  { id: 1, label: "Супер-Администратор", value: 1 },
  { id: 2, label: "Администратор", value: 2 },
  { id: 3, label: "Менеджер", value: 3 },
  { id: 4, label: "Логист", value: 4 },
  { id: 5, label: "Администратор компании", value: 5 },
];

export enum PERIOD {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all'
}

export const selectValues: Array<ITabSelectValue<PERIOD>> = [
  {
    id: 1,
    label: 'Неделя',
    value: PERIOD.WEEK
  },
  {
    id: 2,
    label: 'Месяц',
    value: PERIOD.MONTH
  },
  {
    id: 3,
    label: 'Год',
    value: PERIOD.YEAR
  },
  {
    id: 4,
    label: 'За все время',
    value: PERIOD.ALL
  },
];