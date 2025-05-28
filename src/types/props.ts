import { CSSProperties, ReactNode, ReactElement } from 'react';

export interface IWithSx {
  sx?: CSSProperties
}

export interface IWithClass {
  className?: string;
}

export interface IWithChildren {
  children?: ReactNode | ReactElement;
}
