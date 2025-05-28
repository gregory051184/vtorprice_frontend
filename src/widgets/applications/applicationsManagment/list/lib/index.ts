export const headers = [
    {
      key: 1,
      label: 'Дата создания',
      ordering: 'createdAt'
    },
    {
        key: 2,
        label: 'Статус',
        ordering: 'status'
    },
    {
      key: 3,
      label: 'Вторсырье',
    },
    {
      key: 4,
      label: 'Цена',
    },
    {
      key: 5,
      label: 'Вес',
    },
    {
      key: 6,
      label: 'Адрес',
    },
  ];

export const headersEquipment = [
    {
        key: 1,
        label: 'Дата создания',
        ordering: 'created_at__gte'
    },
    {
        key: 2,
        label: 'Статус',
        ordering: 'status'
    },
    {
        key: 3,
        label: 'Тип',
        ordering: 'deal_type'
    },
    {
        key: 4,
        label: 'Оборудование',
        ordering: 'equipment'
    },
    {
        key: 5,
        label: 'Цена',
        ordering: 'price__lte',
    },
    {
        key: 7,
        label: 'Адрес',
        ordering: 'city',
    },
];