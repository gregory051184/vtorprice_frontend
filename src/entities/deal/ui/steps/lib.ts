import { DealType } from '../../model';

export const steps = {
  [DealType.RECYCLABLES]: [
    {
      id: 0,
      label: 'Создание сделки'
    },
    {
      id: 1,
      label: 'Согласование условий'
    },
    {
      id: 2,
      label: 'Назначение логиста'
    },
    {
      id: 3,
      label: 'Машина загружена'
    },
    {
      id: 4,
      label: 'Машина выгружена'
    },
    {
      id: 5,
      label: 'Окончательная приемка'
    },
  ],
  [DealType.TRANSPORT]: [
    {
      id: 0,
      label: 'Создание сделки'
    },
    {
      id: 1,
      label: 'Назначение логиста'
    },
    {
      id: 2,
      label: 'Машина загружена'
    },
    {
      id: 3,
      label: 'Машина выгружена'
    },
    {
      id: 4,
      label: 'Окончательная приемка'
    },

  ]
};
