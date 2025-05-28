import {useEvent, useGate, useStore} from "effector-react";
import {Button, Modal} from "@box/shared/ui";
import React from "react";
import {$subscribe, subscribeGate} from "@box/entities/subscribe";
import {useRouter} from "next/router";
import {
    $acceptSubscribe,
    $showSubscribeModal,
    setShowSubscribeModal
} from "@box/widgets/subscribeModal";


export const SubscribeModal = () => {
    const showSubscribe = useStore($showSubscribeModal)
    const setShowModal = useEvent(setShowSubscribeModal)
    const subscribe = useStore($subscribe)
    const router = useRouter();
    const subLevel = useStore($acceptSubscribe)
    useGate(subscribeGate)
    return (
        //@ts-ignore
        <Modal title={subscribe ? `Ваша подписка ${subscribe?.subscribe?.name}` : 'Подписка отсутствует'}
               visible={showSubscribe} close={() => {
            setShowModal(false)
            router.back()
        }}>
            <p className="text-center text-grey-90">
                {subscribe ? `Уровень Вашей подписки - ${subscribe?.subscribe?.level?.id}, он не подходит для данного раздела биржи, нужно купить не ниже ${subLevel}` :
                    `Чтобы продолжить купите подписку не ниже ${subLevel}`}
            </p>
            <div className="flex gap-[10px] mt-[20px]">
                <Button
                    onClick={() => {
                        router.push('/subscribes')
                        setShowModal(false)
                    }}
                    className="grow">
                    Перейти к подпискам
                </Button>
                <Button
                    onClick={() => {
                        setShowModal(false)
                        router.back()
                    }}
                    className="grow"
                    mode="light">
                    Отменить
                </Button>
            </div>
        </Modal>
    );
};