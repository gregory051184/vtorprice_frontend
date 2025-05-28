import React from 'react';
import s from './style.module.scss';

export const TextClamp:React.FC<{ children:string }> = ({ children }) => (
  <p className={s.text}>{children}</p>
);
