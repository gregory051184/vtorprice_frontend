import {$authStore} from '@box/entities/auth';
import {Button} from '@box/shared/ui';
import {useEvent, useGate, useStore} from 'effector-react';
import React, {useEffect} from 'react';
import Add from '@assets/icons/16_add.svg';
import Link from 'next/link';
import classNames from 'classnames';
import {Avatar} from '../avatar';
import s from './style.module.scss';
import {ROLE} from '@box/types';
import {$subscribe, subscribeEvent, subscribeGate} from "@box/entities/subscribe";
import router from "next/router";
import {
    acceptSubscribeFX,
    setShowSubscribeModalFX, subscribeLevels
} from "@box/widgets/subscribeModal";
import {useScreenSize} from "@box/shared/hooks";


export const ProfileShortcut = () => {
    const {user} = useStore($authStore);
    const currentSubscribe = useStore($subscribe);

    const setShowSubscribeFx = useEvent(setShowSubscribeModalFX)

    const acceptSubscribe = useEvent(acceptSubscribeFX)

    const updateSubscribeAlert = useEvent(subscribeEvent);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';


    let nameOfProfile: string | undefined;
    let avatar: string | null;
    switch (user?.role.id as ROLE) {
        case ROLE.ADMIN:
        case ROLE.MANAGER:
        case ROLE.LOGIST:
            nameOfProfile = user?.first_name || user?.last_name ? `${user?.first_name} ${user?.last_name}` : 'Нет ФИО';
            avatar = user?.image ? `${process.env.NEXT_PUBLIC_API_URL}${user?.image as string}` : null;
            break;
        default:
            nameOfProfile = user?.company ? user.company.name : 'Нет компании';
            avatar = user?.company?.image ? `${process.env.NEXT_PUBLIC_API_URL}${user?.company?.image}` : null;
    }

    useEffect(() => {
        //@ts-ignore
        if (currentSubscribe?.id > 0 && currentSubscribe?.isDeleted === false && +currentSubscribe?.company === +user?.company?.id) {
            const interval = setInterval(
                () => {
                    const currentDay = new Date().getDay();
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    const date = currentSubscribe?.timeEnd.toString().split('-')

                    if (date && +date[0] === +currentYear.toString() && +date[1] > +currentMonth.toString() && +date[2].split('T')[0] > +currentDay.toString()) {
                        //@ts-ignore
                        updateSubscribeAlert({id: currentSubscribe?.id, is_deleted: true});
                    }
                }, 100000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [currentSubscribe]);

    useGate(subscribeGate)
    return (
        <div className="flex items-center gap-[28px]">
            <div>
                <div
                    className={currentSubscribe ? s.headerSubscribeExists : s.headerSubscribeNotExists}
                    onClick={() => router.push('/subscribes')}
                >
                    {currentSubscribe ? `${currentSubscribe?.subscribe?.name}` : 'Нет подписки'}
                </div>
                {/*<Button
                    className={isMobile ? "ml-4" : ""}
                    onClick={() => {
                        acceptSubscribe(subscribeLevels.ABSOLUTE)
                        setShowSubscribeFx(subscribeLevels.ABSOLUTE).then(data => {
                            if (!data) {
                                router.push("/new-application")
                            }
                        })
                    }}
                    iconLeft={<Add/>} type={isMobile ? "micro" : "mini"} mode="stroke">
                    Заявка
                </Button>*/}
                <Button
                    className={isMobile ? "ml-4" : ""}
                    onClick={() => router.push("/new-application")}
                    iconLeft={<Add/>} type={isMobile ? "micro" : "mini"} mode="stroke">
                    Заявка
                </Button>
            </div>
            <Link href="/profile/settings">
                <div className="max-w-[180px] cursor-pointer flex gap-[10px] items-center">
                    <div className={classNames('grow-1 overflow-hidden', s.new_application_button)}>
                        <p className=" text-sm whitespace-nowrap overflow-hidden font-semibold text-ellipsis">{nameOfProfile}</p>

                    </div>
                    <Avatar className="shrink-0" size="sm" url={avatar}/>
                </div>
            </Link>
        </div>
    );
};
