import React from 'react';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import Image from 'next/image';
import { team } from '../lib';
import s from './style.module.scss';

export const Team:React.FC<IWithClass> = ({
  className
}) => (
  <div className={className}>
    <div className={classNames('flex flex-wrap', s.advantages)}>
      {team.map((el, num) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={num} className={s.advantages_card}>
          <div className="">
            <Image src={el.img} width={286} height={286} alt={el.name} />
            <p className="mt-5 mb-4 text-2xl">{el.name}</p>
            <p className="text-grey-50">{el.profile}</p>
            <p className="text-base text-grey-80 mt-5 leading-6">{el.description}</p>
            <p className="text-2xl mt-4 mb-2">{el.phone}</p>
            <p className="text-primaryGreen-main font-medium">{el.email}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

);
