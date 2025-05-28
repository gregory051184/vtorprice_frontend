import React from 'react';
import { IWithChildren, IWithClass } from '@types';
import { useRouter } from 'next/router';
import NavArrow from '@assets/icons/nav_arrow.svg';
import classNames from 'classnames';

export const BackButton: React.FC<IWithClass & IWithChildren> = ({
  className,
  children,
}) => {
  const router = useRouter();

  return (
    <button type="button" className={classNames('flex gap-[10px] text-grey-50 items-center', className)} onClick={router.back}>
      <NavArrow className="fill-grey-50" />
      {children || 'Назад'}
    </button>
  );
};
