import { ReactNode } from 'react';

export interface IAuthView {
  authorizedComponent: ReactNode
  unauthorizedComponent: ReactNode
}
