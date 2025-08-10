import Org from "@assets/icons/24_organizations.svg";
import App from "@assets/icons/24_appeals.svg";
import Chat from "@assets/icons/24_chat.svg";
import Not from "@assets/icons/24_notifications.svg";
import Wal from "@assets/icons/24_wallet.svg";
import Deals from "@assets/icons/24_deals.svg";
import Fav from "@assets/icons/24_favorites.svg";
import Set from "@assets/icons/24_settingsFilled.svg";
import Acc from "@assets/icons/24_access.svg";
import Dealer from "@assets/icons/24_dealer.svg";
import Analytics from "@assets/icons/24_analytics.svg";
import Logistic from "@assets/icons/24_logistic.svg";
import Cont from "@assets/icons/24_contractors.svg";

import GenerateProposal from "@assets/icons/Generate_proposal.svg";

import {ROLE} from "@box/types";
import {ReactNode} from "react";

const lastTabs = [
    {
        label: "Уведомления",
        icon: <Not/>,
        href: "/profile/notifications",
        notifications: true
    },
    {
        label: "Чат",
        icon: <Chat/>,
        href: "/profile/chats",
    },
    {
        label: "Настройки",
        icon: <Set/>,
        href: "/profile/settings",
    },
];

export const tabs: Record<
    ROLE,
    Array<{
        label: string;
        icon: ReactNode;
        href: string;
    }>
> = {
    [ROLE.ADMIN]: [
        // {
        //     label: "Модерация заявок",
        //     icon: <App/>,
        //     href: "/applications-verification",
        // },
        {
            label: "Все компании",
            icon: <Org/>,
            href: "/profile/my-company",
        },
        {
            label: "Заявки всех компаний",
            icon: <App/>,
            href: "/profile/applications-management",
        },
        {
            label: "Cтатус и верификация",
            icon: <Cont/>,
            href: "/companies-verification",
        },
        {
            label: "Активные сделки",
            icon: <Deals/>,
            href: "/profile/deals",
        },
        {
            label: "Генерировать предложения",
            icon: <GenerateProposal/>,
            href: "/profile/generate-list-of-offers",
        },
        {
            label: "Заявки от пользователей",
            icon: <Dealer/>,
            href: "/applications-from-users",
        },
        {
            label: "Права доступа",
            icon: <Acc/>,
            href: "/profile/access-rights",
        },
        {
            label: "Финансовые показатели",
            icon: <Analytics/>,
            href: "/profile/financial-data",
        },
        {
            label: "Избранное",
            icon: <Fav/>,
            href: "/profile/favorites",
        },
        ...lastTabs,
    ],
    [ROLE.LOGIST]: [
        {
            label: "Активные сделки",
            icon: <Deals/>,
            href: "/profile/logist-active-deals",
        },
        {
            label: "Заявки на перевозку",
            icon: <Logistic/>,
            href: "/profile/transport-applications",
        },
        {
            label: "Аналитика",
            icon: <Analytics/>,
            href: '/profile/analytics'
        },
        {
            label: "Контрагенты",
            icon: <Cont/>,
            href: "/profile/contractors",
        },
        ...lastTabs,
    ],
    [ROLE.SUPER_ADMIN]: [],
    [ROLE.COMPANY_ADMIN]: [
        {
            label: "Счета на оплату",
            icon: <Wal/>,
            href: "/profile/payment-invoices",
        },
        {
            label: "Мои заявки",
            icon: <App/>,
            href: "/profile/applications",
        },
        {
            label: "Активные сделки",
            icon: <Deals/>,
            href: "/profile/deals",
        },
        {
            label: "Логистика",
            icon: <Logistic/>,
            href: "/profile/logistics",
        },
        {
            label: "Добавить сотрудника",
            icon: <svg id="svg" fill="#a3a3a3" stroke="#a3a3a3" width="24" height="24" version="1.1"
                       viewBox="143 143 514 514" xmlns="http://www.w3.org/2000/svg">
                <g id="IconSvg_bgCarrier" strokeWidth="0"></g>
                <g id="IconSvg_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC"
                   strokeWidth="0">
                    <g xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m615.24 288.04c0-2.9375-2.3789-5.3164-5.3164-5.3164h-50.801l-0.003906-50.66c0-2.9375-2.3789-5.3164-5.3164-5.3164-2.9375-0.003906-5.0391 2.3789-5.0391 5.3164v50.801h-50.801c-2.9375 0-5.3164 2.3789-5.3164 5.3164s2.3789 5.3164 5.3164 5.3164h50.801v50.523c0 2.9375 2.3789 5.3164 5.3164 5.3164s5.3164-2.3789 5.3164-5.3164v-50.801h50.523c2.9414 0.14062 5.3203-2.2383 5.3203-5.1797z"></path>
                        <path
                            d="m184.9 539.95v83.969c0 2.9375 2.3789 5.3164 5.3164 5.3164h307.88c2.9375 0 5.3164-2.3789 5.3164-5.3164v-83.969c0-66.477-41.844-125.81-103.28-148.9 37.645-20.293 61.297-59.477 61.297-103 0-64.656-52.621-117.28-117.28-117.28-64.648 0-117.27 52.621-117.27 117.27 0 43.523 23.652 82.57 61.297 103-61.438 23.094-103.28 82.434-103.28 148.91zm117.14-131.13h83.973c2.9375 0 5.3164 2.3789 5.3164 5.3164s-2.3789 5.3164-5.3164 5.3164h-8.8164l-0.003906 134.49c0 0.98047-0.28125 2.0977-0.83984 2.9375l-27.988 41.984c-0.98047 1.3984-2.6602 2.3789-4.3398 2.3789-1.6797 0-3.3594-0.83984-4.3398-2.3789l-27.988-41.984c-0.55859-0.83984-0.83984-1.8203-0.83984-2.9375v-134.77h-8.8164c-2.9375 0-5.3164-2.3789-5.3164-5.3164 0-2.9414 2.3789-5.0391 5.3164-5.0391z"></path>
                        <path d="m366.83 552.4v-133.09h-45.484v133.09l22.672 34.004z"></path>
                    </g>

                </g>
                <g id="IconSvg_iconCarrier">
                    <g xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m615.24 288.04c0-2.9375-2.3789-5.3164-5.3164-5.3164h-50.801l-0.003906-50.66c0-2.9375-2.3789-5.3164-5.3164-5.3164-2.9375-0.003906-5.0391 2.3789-5.0391 5.3164v50.801h-50.801c-2.9375 0-5.3164 2.3789-5.3164 5.3164s2.3789 5.3164 5.3164 5.3164h50.801v50.523c0 2.9375 2.3789 5.3164 5.3164 5.3164s5.3164-2.3789 5.3164-5.3164v-50.801h50.523c2.9414 0.14062 5.3203-2.2383 5.3203-5.1797z"></path>
                        <path
                            d="m184.9 539.95v83.969c0 2.9375 2.3789 5.3164 5.3164 5.3164h307.88c2.9375 0 5.3164-2.3789 5.3164-5.3164v-83.969c0-66.477-41.844-125.81-103.28-148.9 37.645-20.293 61.297-59.477 61.297-103 0-64.656-52.621-117.28-117.28-117.28-64.648 0-117.27 52.621-117.27 117.27 0 43.523 23.652 82.57 61.297 103-61.438 23.094-103.28 82.434-103.28 148.91zm117.14-131.13h83.973c2.9375 0 5.3164 2.3789 5.3164 5.3164s-2.3789 5.3164-5.3164 5.3164h-8.8164l-0.003906 134.49c0 0.98047-0.28125 2.0977-0.83984 2.9375l-27.988 41.984c-0.98047 1.3984-2.6602 2.3789-4.3398 2.3789-1.6797 0-3.3594-0.83984-4.3398-2.3789l-27.988-41.984c-0.55859-0.83984-0.83984-1.8203-0.83984-2.9375v-134.77h-8.8164c-2.9375 0-5.3164-2.3789-5.3164-5.3164 0-2.9414 2.3789-5.0391 5.3164-5.0391z"></path>
                        <path d="m366.83 552.4v-133.09h-45.484v133.09l22.672 34.004z"></path>
                    </g>

                </g>
            </svg>,
            href: "/profile/company-staff-management",
        },
        {
            label: "Избранное",
            icon: <Fav/>,
            href: "/profile/favorites",
        },
        ...lastTabs,
    ],
    [ROLE.MANAGER]: [
        {
            label: "Модерация заявок",
            icon: <App/>,
            href: "/applications-verification",
        },
        /*{
            label: "Мои компании",
            icon: <Org/>,
            href: "/profile/my-company",
        },*/

        {
            label: "Мои компании и верификация",
            icon: <Cont/>,
            href: "/companies-verification",
        },

        {
            label: "Заявки моих компаний",
            icon: <App/>,
            href: "/profile/applications-management",
        },
        {
            label: "Генерировать предложения",
            icon: <GenerateProposal/>,
            /*<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path
                    d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
                ></path>
            </svg>,*/
            href: "/profile/generate-list-of-offers",
        },
        {
            label: "Активные сделки",
            icon: <Deals/>,
            href: "/profile/deals",
        },
        {
            label: "Логистика",
            icon: <Logistic/>,
            href: "/profile/logistics",
        },
        {
            label: "Заявки от пользователей",
            icon: <Dealer/>,
            href: "/applications-from-users",
        },
        {
            label: "Финансовые показатели",
            icon: <Analytics/>,
            href: "/profile/financial-data",
        },
        {
            label: "Избранное",
            icon: <Fav/>,
            href: "/profile/favorites",
        },
        ...lastTabs,
    ],
    [ROLE.COMPANY_STAFF]: [
        {
            label: "Счета на оплату",
            icon: <Wal/>,
            href: "/profile/payment-invoices",
        },
        {
            label: "Мои заявки",
            icon: <App/>,
            href: "/profile/applications",
        },
        {
            label: "Активные сделки",
            icon: <Deals/>,
            href: "/profile/deals",
        },
        {
            label: "Логистика",
            icon: <Logistic/>,
            href: "/profile/logistics",
        },
        {
            label: "Избранное",
            icon: <Fav/>,
            href: "/profile/favorites",
        },
        ...lastTabs,
    ]
};
