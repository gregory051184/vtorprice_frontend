import { $authStore } from '@box/entities/auth';
import { useStore } from 'effector-react';
import React from 'react';
import { IAuthView } from './types';

export const AuthView: React.FC<IAuthView> = ({
  authorizedComponent,
  unauthorizedComponent
}) => {
  const authStore = useStore($authStore);

  if (authStore.isAuth) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{authorizedComponent}</>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{unauthorizedComponent}</>;
};
