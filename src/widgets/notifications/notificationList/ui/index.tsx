import React, {useState} from "react";
import {useRouter} from "next/router";
import {Pagination, Table, Tip} from "@box/shared/ui";
import {IWithClass} from "@box/types";
import {useGate, useStore, useUnit} from "effector-react";
import {notificationModel} from "@box/widgets/notifications/notificationList";
import {NotificationRow} from "@box/entities/notification/ui/rows/notificationRow";
import {SearchDebounce} from "@box/shared/ui/input/searchDebounce";
import {useField} from "@box/shared/effector-forms";
import {headers} from "../lib";
import s from "./style.module.scss";


export const NotificationList: React.FC<IWithClass> = ({className}) => {
    useGate(notificationModel.gate);
    const notifications = useStore(notificationModel.$notificationsList);
    const search = useField(notificationModel.filters.fields.search);
    const loading = useStore(notificationModel.notificationsLoading.$loaderStore);
    const router = useRouter();
    const changeFlagIsRead = useUnit(notificationModel.getOneNotificationFx);

    const [showDeletedNotifications, setShowDeletedNotifications] = useState<boolean>(false);

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

    const handleOnClick = (id: number, type: string, idObject: number) => {
        changeFlagIsRead(id);
        router.push(realUrls[type](idObject));
    };

    return (
        <div className={className}>
            <SearchDebounce
                className={s.search_view}
                value={search.value}
                onChange={search.onChange}
            />
            {
                !showDeletedNotifications ?
                    <Tip>
                        Нажав на уведомление вы перейдёте к событию, которое оно отражает,
                        а само уведомление перейдёт в архив, откуда его можно будет удалить.
                    </Tip> :
                    <Tip>
                        Нажав на уведомление вы перейдёте к событию, которое оно отражает,
                        а нажав на урну вы навсегда удалите уведомление.
                    </Tip>
            }
            <div
                onClick={() => setShowDeletedNotifications(!showDeletedNotifications)}
                className={s.switch_button}>
                {!showDeletedNotifications ?
                    <p>Показать архивные уведомления</p> :
                    <p>Вернуться к текущим уведомления</p>
                }
            </div>
            <Table
                separate
                loading={loading}
                pagination={<Pagination pagination={notificationModel.pagination}/>}
                empty={notifications.length === 0}
                className={s.table_view}
            >
                <Table.Head className={s.head} headers={headers}/>
                {!showDeletedNotifications &&
                    <Table.Body>
                        {notifications.filter(notification => !notification.isRead).map((notification) => (
                            <NotificationRow
                                notification={notification}
                                key={notification.id}
                                onClick={() =>
                                    handleOnClick(notification.id, notification.contentType, notification.objectId)
                                }
                            />
                        ))}
                    </Table.Body>}
                {showDeletedNotifications && <Table.Body>
                    {notifications.filter(notification => notification.isRead).map((notification) => (
                        <NotificationRow
                            notification={notification}
                            key={notification.id}
                        />
                    ))}
                </Table.Body>}
            </Table>
        </div>
    );
};
