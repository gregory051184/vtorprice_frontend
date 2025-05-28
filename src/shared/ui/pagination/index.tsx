import classNames from 'classnames';
import React from 'react';
import { usePagination } from '@box/shared/lib/factories';
import { useBoolean } from '@box/shared/hooks';
import { Popover } from '@box/shared/ui';
import s from './style.module.scss';
import { IPagination } from './types';

export const Pagination: React.FC<IPagination> = ({
  pagination: paginationStore,
  hasUpdate = false,
  withoutPositionsPerPage = false,
}) => {
  const pagination = usePagination(paginationStore);
  const { value, toggle, setValue } = useBoolean(false);
  if (pagination.currentPage >= pagination.totalPages && !hasUpdate) {
    return null;
  }
  return (
    <div className={classNames('flex justify-center relative', s.container)}>
      <div className={classNames('flex', s.top)}>
        {hasUpdate && <button onClick={pagination.setFirstPage} className={classNames(s.button, s.update, 'bg-grey-10 rounded-full text-sm font-semibold mr-[16px]')}
                              type="button">Обновить</button>}
        {pagination.currentPage < pagination.totalPages && < button onClick={pagination.loadMore} type="button" className={classNames(s.button, 'bg-grey-10 rounded-full text-sm font-semibold')}>
          Загрузить еще
        </button>}
      </div>

      <Popover width={60} center opened={value} close={() => setValue(false)}>
        <Popover.Target>
          <div onClick={toggle} className={classNames(s.perpage, `flex gap-4 cursor-pointer items-center 
          ${withoutPositionsPerPage ? 'hidden' : undefined}`)}>
            <p className="text-grey-50 text-sm whitespace-nowrap">Позиций на страницу</p>

            <p>{pagination.perPage}</p>

          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <div className="shadow p-[10px] border border-grey-20 rounded-[5px] bg-white">
            <p onClick={() => pagination.setPerPage(7)} className="cursor-pointer">7</p>
            <p onClick={() => pagination.setPerPage(10)} className="cursor-pointer">10</p>
            <p onClick={() => pagination.setPerPage(12)} className="cursor-pointer">12</p>
          </div>
        </Popover.Dropdown>
      </Popover>

    </div>
  );
};
