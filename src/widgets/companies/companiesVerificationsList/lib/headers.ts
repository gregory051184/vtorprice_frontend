export const headers = [
  {
    key: 1,
    title: 'Название',
  },
  {
    key: 2,
    title: 'Дата создания'
  },
  {
    key: 3,
    title: 'Адрес',
  },
];

export const statusHeaders = [
  {
    label: 'Название',
    ordering: 'name'
  },
  {
    label: 'Дата создания',
    ordering: 'created_at'
  },
  {
    label: 'Статус',
    //ordering: 'status'
  },
  {
    label: 'Менеджер',
    ordering: 'manager_id'
  },
  {
    label: 'Маркировка',
    ordering: 'recyclables_count'
  },

]

export const managersResults = [
  {
    label: "ФИО"
  },
  {
    label: "Должность"
  },
  // {
  //   label: "Всего действий"
  // },
  {
    label: "Последняя активность"
  },
  // {
  //   label: "Объём сделок"
  // }
]
