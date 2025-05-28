import React from 'react';
import { Separator } from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import classNames from 'classnames';
import Link from 'next/link';
import { ICompanyCard } from './types';

export const MyCompanyCard: React.FC<ICompanyCard> = ({
  company,
  className
}) => (
  <Link href={`/profile/my-company/${company.id}`} className={classNames('p-[16px] bg-grey-10 rounded-[10px]', className)}>
    <div className="flex gap-[10px]">
      <Avatar className="shrink-0" size="sm" url={company?.image || null} />
      <div>
        <p>
          {company.name}
        </p>
      </div>
    </div>
    <Separator h={10} />
    <div className="flex gap-[25px] flex-wrap">
      <div className="">
        <p className="text-xs text-grey-40">Тип компании</p>
        {company.activities.length > 0 ? company.activities.map((item) => <p key={item} className="text-sm mt-[2px]">{item}</p>) : '-'}
      </div>
    </div>
    <Separator h={10} />
    <p className="text-sm mt-[2px]">{company.address || '-'}</p>
  </Link>

);
