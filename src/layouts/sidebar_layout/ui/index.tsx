import { Collapse, Container } from '@box/shared/ui';
import { IWithChildren } from '@box/types';
import { Sidebar } from '@box/widgets/sidbar';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import Arrow from '@assets/icons/select_arrow_bottom.svg';
import { useBoolean } from '@box/shared/hooks';
import s from './style.module.scss';
import {useEvent} from 'effector-react';
import { mainNotificationsEvent } from '@box/widgets/notifications/notificationList/model';

export const SidebarLayout: React.FC<IWithChildren> = ({
  children
}) => {
  const { value, toggle } = useBoolean(false);
  const showDropdown = typeof window !== 'undefined' ? window.innerWidth < 1023 : false;
  const updateNotificaionsCount = useEvent(mainNotificationsEvent);

  // Управление интервалом для обновления счетчика уведомлений.
  useEffect(() => {
    updateNotificaionsCount()
    const interval = setInterval(
      ()=>{
        updateNotificaionsCount()
      }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container>
      <div className={classNames('pt-8 flex gap-16 mt-[-30px]', s.layout)}>
        <button onClick={toggle} type="button" className={classNames('gap-[10px] bg-secondaryGreen-light px-[16px] py-[8px] rounded-full text-primaryGreen-main font-semibold', s.button)}>
          Меню
          {' '}
          <Arrow />
        </button>
        <Collapse className="shrink-0" animate={false} opened={showDropdown ? value : true}>
          <div className={s.sidebar}>
            <Sidebar className={classNames('sticky top-[112px] left-0', s.sidebar_inner)} />
          </div>
        </Collapse>

        <div className="grow overflow-hidden">
          {children}
        </div>
      </div>
    </Container>
  );
};
