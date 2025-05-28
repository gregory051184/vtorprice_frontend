import { $authStore, logoutEvent } from '@box/entities/auth';
import { IWithClass, ROLE } from '@box/types';
import classNames from 'classnames';
import { useEvent, useStore, useStoreMap } from 'effector-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {ReactNode} from 'react';
import { tabs } from '../lib/tabs';
import s from './style.module.scss';
import { Rating } from '@box/shared/ui';
import { ICompany } from '@box/entities/company/model';
import { $notificationsUnreadCount } from '@box/widgets/notifications/notificationList/model';

interface ITab {
  label: string,
  href: string,
  icon: ReactNode,
  notifications?: boolean
}

const Tab: React.FC<ITab> = ({
  label,
  href,
  icon,
  notifications = false
}) => {
  const router = useRouter();
  const current = router.asPath.startsWith(href);
  const n_notifications = useStore($notificationsUnreadCount);

  return (
    <div className={classNames(
      { [s.tab_inactive]: !current },
      { [s.tab_active]: current },
    )}
    >
      <Link href={href} className="flex items-center gap-[16px]">
        {icon}
        {' '}
        <p className="font-medium">{label}</p>
        {notifications &&
        <div className='bg-[#FF2C52] rounded-full text-[#FFFFFF] text-xs'>
          <p className={`my-[0px] mx-[6px] rounded-full text-xs ${s.notification_text_color}`}>
            {n_notifications === 1 && n_notifications/*n_notifications === 0 ? "0" : n_notifications*/}
          </p>
        </div>}
      </Link>
    </div>
  );
};

export const Sidebar: React.FC<IWithClass> = ({
  className
}) => {
  const user = useStoreMap({
    store: $authStore,
    keys: ['user'],
    fn: (val) => val.user
  });
  const logout = useEvent(logoutEvent);

  let nameOfProfile: string | undefined;
  let hidden = '';
  
  switch (user?.role?.id as ROLE) {
    case ROLE.MANAGER:
    case ROLE.LOGIST:
    case ROLE.ADMIN:
      nameOfProfile = user?.first_name || user?.last_name ? `${user?.last_name} ${user?.first_name} ${user?.middle_name}` : 'Нет ФИО';
      hidden = 'hidden';
      break;
    default:
      nameOfProfile = user?.company ? user.company.name : 'Нет компании';
  }
  const company: ICompany | undefined = user?.company;

  return (
    <div className={classNames('shrink-0 w-[230px]', className)}>
      <div className='flex flex-col gap-[6px] mb-[30px]'>
        <div className='font-semibold text-xl'>
          {nameOfProfile}
        </div>
        <Rating className={hidden} rating={company?.averageReviewRate || 0} total={company?.dealsCount || 0} />
      </div>
      {user && (
        <div className=" flex flex-col gap-[20px]">
          {(tabs[user?.role.id as ROLE]).map((tab) => <Tab key={tab.label} {...tab} />)}
          <div
            onClick={(ev) => {
              ev.stopPropagation();
              logout();
            }}
            className={classNames(s.tab_inactive, 'cursor-pointer')}
          >
            <p className="font-medium">Выйти</p>
          </div>

        </div>
      )}
    </div>
  );
};
