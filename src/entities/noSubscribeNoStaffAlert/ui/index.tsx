import {$authStore} from '@box/entities/auth';
import {BlurOverlay, Button} from '@box/shared/ui';
import classNames from 'classnames';
import {useGate, useStore} from 'effector-react';
import React, {useEffect, useRef, useState} from 'react';
import s from './style.module.scss';
import {useRouter} from 'next/router';
import {$subscribe, subscribeGate} from "@box/entities/subscribe";


export const NoSubscribeNoStaffAlert = () => {
    useGate(subscribeGate)
    const authStore = useStore($authStore);
    const subscribe = useStore($subscribe)
    const bodyRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [visible, setVisible] = useState<boolean>(false);

    const examStaffHandler = () => {
        if (authStore?.user && authStore?.user?.company?.staff.includes(authStore.user.id)) {
            if (subscribe) {
                const currentSubscribeList = subscribe?.subscribe?.staffCount
                const currentStaffList = authStore?.user?.company?.staff.length
                const staff = authStore?.user?.company?.staff
                const result = currentSubscribeList - currentStaffList
                if (result < 0) {
                    const shortStaffList = staff.slice(0, (result * (-1)))
                    return shortStaffList.includes(authStore.user.id)
                } else {
                    return false
                }
            } else {
                return true
            }
        } else {
            return false
        }
    }

    useEffect(() => {
        setVisible(examStaffHandler());
    }, [authStore, subscribe]);

    return (

        <BlurOverlay childRef={bodyRef} visible={visible} animationDuration={200} close={() => {
        }}>
            <div ref={bodyRef} className={classNames(s.body_wrapper)}>
                <div className={classNames('bg-grey-10', s.body)}>
                    <h2 className="text-2xl font-medium text-center mb-4">{"Действие недоступно"}</h2>
                    <p className="text-sm text-center text-grey-90">
                        {subscribe ? "Для использования профиля данного аккаунта Вам нужно приобрести подписку с большим количеством возможного персонала" :
                            "У Вашей компании закончилась подписка"}
                    </p>
                    <div className="flex justify-between gap-[10px] mt-[30px]">
                        <Button
                            fullWidth={true}
                            mode='light'
                            onClick={() => {
                                router.back()
                                setVisible(false)
                            }}>
                            Назад
                        </Button>
                    </div>
                    <div className="flex justify-between gap-[10px] mt-[30px]">
                        <Button
                            onClick={() => {
                                router.push('/subscribes')
                                setVisible(false)
                            }}
                            mode='light'
                            fullWidth={true}
                            className="grow">
                            Перейти к подпискам
                        </Button>
                    </div>
                </div>
            </div>

        </BlurOverlay>
    );
};