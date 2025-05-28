import { IWithClass } from '@types';
import { ReactNode } from "react";

export interface ITip extends IWithClass {
  children: ReactNode
  link?: {
    text: string
    onClick: ()=>void
  },
  isBlue?: boolean;
}
