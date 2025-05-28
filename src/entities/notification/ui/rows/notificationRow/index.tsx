import React from 'react';
import classNames from 'classnames';
import {Table} from '@box/shared/ui';
import {INotificationRow} from './types';
import TrashIcon from "@assets/icons/24_delete.svg";
import {useUnit} from "effector-react";
import {deleteNotificationFx} from "@box/widgets/notifications/notificationList/model";
import {useRouter} from "next/router";

export const NotificationRow: React.FC<INotificationRow> = ({notification, onClick}) => {
    const removeNotification = useUnit(deleteNotificationFx)
    const removeNotificationHandler = (id: number) => {
        removeNotification(id)
    }
    const router = useRouter();

    const realUrls: { [key: string]: (id: number) => string } = {
        chat: (id) => `/profile/chats/${id}`,
        companyverificationrequest: (id) => `/companies/${id}`,
        recyclablesapplication: (id) => `/profile/applications/${id}`,
        recyclablesdeal: (id) => `/deals/${id}`,
        equipmentapplication: (id) => `/equipment-applications/${id}`,
        transportapplication: (id) => `/profile/transport-applications/${id}`,
        logisticsoffer: (id) => `/profile/logistics/${id}`,
        equipmentdeal: (id) => `/equipment-deals/${id}`,
    };

    const handleOnClickArchNotification = (id: number, type: string, idObject: number) => {
        router.push(realUrls[type](idObject));
    };


    return (
        <Table.Row onClick={onClick} isHover={false}
                   className={!notification.isRead ? 'h-[60px] cursor-pointer' : 'h-[60px]'}>
            <Table.Cell>
                {notification.isRead ? <p
                        onClick={() => handleOnClickArchNotification(notification.id, notification.contentType, notification.objectId)}
                        className={classNames({'text-[#2F8063]': notification.isRead}, 'cursor-pointer')}>
                        {notification.name}</p> :
                    <p
                        className={classNames({'text-[#2F8063]': notification.isRead})}>
                        {notification.name}</p>
                }
            </Table.Cell>
            <Table.Cell>
                <p className={classNames({'text-[#2F8063]': notification.isRead})}>
                    {new Intl.DateTimeFormat('ru-RU', {
                        month: 'long',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    }).format(new Date(notification.createdAt))}
                    {' '}
                </p>
            </Table.Cell>
            {notification.isRead &&
                <Table.Cell>
                    <div
                        onClick={() => removeNotificationHandler(notification?.id)}
                    >
                        <TrashIcon className="cursor-pointer" width={30} height={30}/>
                    </div>
                </Table.Cell>
            }
        </Table.Row>
    )
};
