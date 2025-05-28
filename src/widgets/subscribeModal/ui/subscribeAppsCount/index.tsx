import {useEvent, useGate, useStore} from "effector-react";
import {
    $showSubscribeMaxCountModal,
    setShowSubscribeMaxCountOfApplicationsModal,
} from "@box/widgets/subscribeModal";
import {$subscribe, subscribeGate} from "@box/entities/subscribe";
import {useRouter} from "next/router";
import {Button, Modal} from "@box/shared/ui";
import React from "react";

export const SubscribeAppsCountModal = () => {
    const showSubscribe = useStore($showSubscribeMaxCountModal)
    const setShowModal = useEvent(setShowSubscribeMaxCountOfApplicationsModal)
    const subscribe = useStore($subscribe)
    const router = useRouter();
    useGate(subscribeGate)
    return (
        //@ts-ignore
        <Modal title={subscribe ? `Ваша подписка ${subscribe?.subscribe?.name}` : 'Подписка отсутствует'}
               visible={showSubscribe}
               close={() => setShowModal(false)}>
            <p className="text-center text-grey-90">
                {subscribe ? `Количество объявлений у Вашей подписки - ${subscribe?.subscribe?.counter} исчерпано, попробуйте приобрести подписку с большим количеством` : 'Чтобы продолжить купите подписку'}
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
                    onClick={() => setShowModal(false)}
                    className="grow"
                    mode="light">
                    Отменить
                </Button>
            </div>
        </Modal>
    );
};