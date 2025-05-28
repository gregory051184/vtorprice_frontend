import React from 'react';
import Box from '@assets/icons/Breakable.svg';
import Steps from '@assets/icons/Journey.svg';
import Earth from '@assets/icons/Earth Planet.svg';
import Delivery from '@assets/icons/Delivery.svg';
import Sign from '@assets/icons/Signing A Document.svg';
import Bill from '@assets/icons/Bill.svg';

export const cards = [
  {
    title: 'Доставка от адреса к адресу точно в срок',
    description: 'Прямая доставка без посредников в любой регион России и СНГ.',
    icon: <Box />
  },
  {
    title: 'Отслеживание груза в реальном времени',
    description: 'Прямая доставка без посредников в любой регион России и СНГ.',
    icon: <Steps />
  },
  {
    title: 'Работаем по всей России, в СНГ и Европе',
    description: 'Расширяем сеть партнеров, оптимизируем логистику и можем предложить оптимальные цены',
    icon: <Earth />
  },
  {
    title: 'Подача машины в день обращения',
    description: 'Транспорт находится в вашем городе и ждет сигнала к старту. Грузовик идет в рейс сразу после загрузки',
    icon: <Delivery />
  },
  {
    title: 'Быстрый договор и личный логист-менеджер',
    description: 'Готовим договор сразу после обращения. Персональный менеджер от начала и до окончания сделки на связи с вами.',
    icon: <Sign />
  },
  {
    title: 'Гибкие условия оплаты и юридическое сопровождение',
    description: 'Наличный и безналичный расчет. Подготовим необходимый пакет документов для сопровождения перевозки грузов',
    icon: <Bill />
  },
];
