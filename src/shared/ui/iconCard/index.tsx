import React from 'react';
import classNames from 'classnames';
import { IIconCard } from './types';

export const IconCard: React.FC<IIconCard> = ({
  data,
  className,
}) => (
  <div className={classNames(className)}>
    {data.icon}
    <p className="text-[24px] mt-[32px] font-medium text-black">{data.title}</p>
    <p className="text-[16px] text-grey-70 mt-[16px]">{data.description}</p>
  </div>
);
