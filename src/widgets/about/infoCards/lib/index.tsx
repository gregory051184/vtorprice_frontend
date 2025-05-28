import React from 'react';
import Box from '@assets/icons/Breakable.svg';
import Map from '@assets/icons/Map Marker.svg';
import Heat from '@assets/icons/Heat Map.svg';
import Happy from '@assets/icons/Happy.svg';

export const cards = [
  {
    title: '90 000',
    description: 'Тонн отгруженного сырья',
    icon: <Box />
  },
  {
    title: '150',
    description: 'Городов России, СНГ и Европы',
    icon: <Map />
  },
  {
    title: '135',
    description: 'Фракций вторичных полимеров',
    icon: <Heat />
  },
  {
    title: '122',
    description: 'Довольных клиента',
    icon: <Happy />
  },
];
