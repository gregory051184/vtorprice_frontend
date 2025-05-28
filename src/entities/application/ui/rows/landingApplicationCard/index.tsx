import React from 'react';
import { Rating, Separator } from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import classNames from 'classnames';
import Link from 'next/link';
import { ILandingApplicationCard } from './types';
import Verified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';


export const LandingApplicationCard: React.FC<ILandingApplicationCard> = ({
  application,
  className
}) => (
  <Link href={`/applications/${application.id}`} className={classNames('p-[16px] bg-grey-10 rounded-[10px]', className)}>
    <div className="flex gap-[10px]">
      <Avatar className="shrink-0" size="sm" url={application.company?.image || null} />
      <div>
        <p>
          {application.company.name}{" "}
          {application.company.status?.id === 2 && <Verified className="inline" />}
          {application.company.status?.id === 3 && (
            <>
              <Verified className="inline" />
              <Reliable className="inline" />
            </>
          )}
        </p>
        <Rating rating={application.company.averageReviewRate} total={application.company.dealsCount || 0} />
      </div>
    </div>
    <Separator h={10} />
    <p>{application.recyclables.name}</p>
    <Separator h={10} />
    <div className="flex gap-[25px] flex-wrap">
      <div className="">
        <p className="text-xs text-grey-40">Вес, т</p>
        <p className="text-sm mt-[2px]">{(application.totalWeight / 1000).toFixed(1)}</p>
      </div>
      <div className="">
        <p className="text-xs text-grey-40">Цена за 1 т</p>
        <p className="text-sm mt-[2px]">{application.price * 1000}</p>
      </div>
      <div className="">
        <p className="text-xs text-grey-40">Стоимость</p>
        <p className="text-sm mt-[2px]">
          {application.totalPrice}
          {' '}
          ₽
        </p>
      </div>
    </div>
  </Link>
);
