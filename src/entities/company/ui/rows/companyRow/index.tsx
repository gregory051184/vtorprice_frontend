import React from 'react';
import {Table} from '@box/shared/ui';
import { Avatar } from '@box/entities/user';
import Verified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';
import Check from '@assets/icons/16_checkmark.svg';
import { useRouter } from 'next/router';
import StarImg from '@box/shared/ui/starImg';
import { ICompanyRow } from './types';
import { Rating } from '@box/shared/ui';
import dotenv from 'dotenv';


dotenv.config();

export const CompanyRow: React.FC<ICompanyRow> = ({ company, onClickInFavorite }) => {
  const router = useRouter();
  return (
    <Table.Row
      className="cursor-pointer"
      onClick={() => {
        router.push(`/companies/${company.id}`);
      }}
    >
      <Table.Cell className="pr-8 w-[350px]">
        <div className="flex items-center  gap-6">
          <Avatar className="shrink-0" size="sm" url={company?.image || null} />
          <div>
            {company.name}
            <Rating rating={company.averageReviewRate} total={company.dealsCount || 0} />
            {company.status?.id === 2 && <Verified className="inline" />}
            {company.status?.id === 3 && (
              <>
                <Verified className="inline" />
                <Reliable className="inline" />
              </>
            )}
            {company.status?.id === 4 && (<svg width="16" height="17" viewBox="0 0 24 24" fill="none"
                                               xmlns="http://www.w3.org/2000/svg" className="inline">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604ZM16.1925 17.6067L6.39327 7.80749C4.33767 10.5493 4.55666 14.4562 7.05025 16.9497C9.54384 19.4433 13.4507 19.6623 16.1925 17.6067ZM16.9497 7.05025C19.4433 9.54384 19.6623 13.4507 17.6067 16.1925L7.80749 6.39327C10.5493 4.33767 14.4562 4.55666 16.9497 7.05025Z"
                        fill="red"/>
                </svg>
            )}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="pr-8">
        {
          // eslint-disable-next-line react/no-array-index-key
          company.applicationTypes?.map((el, id) => <p key={id}>{el}</p>)
        }
        {
          company.applicationTypes?.length === 0 && <p>Нет</p>
        }
      </Table.Cell>
      <Table.Cell className="pr-6">
       
        {
        // eslint-disable-next-line react/no-array-index-key
          company.activities?.map((el, id) => <p key={id}>{el}</p>)
        }
        {
          company.activities?.length === 0 && <p>Нет</p>
        }
      </Table.Cell>
      <Table.Cell className="pr-6">
        {company.withNds ? <Check /> : 'Нет'}
      </Table.Cell>
      <Table.Cell className="pr-6">
        <p>{company.recyclablesType || 'Нет'}</p>
        {company.recyclablesType && (
          <p className="text-sm font-light text-primaryGreen-main underline">
            И еще
            {' '}
            {company.recyclablesCount - 1}
          </p>
        )}
      </Table.Cell>
      <Table.Cell className="">
        <p>{company.city ? company.city.name : ''}</p>
        <p className="text-sm font-light text-primaryGreen-main underline">
          Адрес
        </p>
      </Table.Cell>
      <Table.Cell>
        <StarImg onClick={(e) => onClickInFavorite(company.id, e)} fill={company.isFavorite ? '#399977' : 'none'} />
      </Table.Cell>
    </Table.Row>
  );
};
