import { ReactElement } from 'react';
import { IWithClass } from '@box/types';

export interface IIconCard extends IWithClass {
  data: {
    icon: ReactElement,
    title: string,
    description: string
  }
}
