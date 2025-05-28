import React from 'react';
import classNames from 'classnames';
import { IAppShell } from './types';
import s from './style.module.scss';
import { useAuhRedirect } from "./hooks";

export const AppShell: React.FC<IAppShell> = ({
  header,
  footer,
  children,
  className
}) => {
  useAuhRedirect();

  return (
  <div className={classNames(s.body, className)}>
    {header}
    <div className={s.content}>
      {children}
    </div>
    {footer}
  </div>
)};
