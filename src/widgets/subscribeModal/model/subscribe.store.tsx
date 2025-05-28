import {createEffect, createEvent, createStore} from "effector";
import {$subscribe} from "@box/entities/subscribe";
import {$authStore} from "@box/entities/auth";
import {subscribeLevels} from "@box/widgets/subscribeModal";


const setShowSubscribeModal = createEvent<boolean>();

//НУЖЕН ЧТОБЫ ПИСАТЬ КАКУЮ ПОДПИСКУ НУЖНО ПРИОБРЕСТИ
const acceptSubscribeFX = createEffect({
    handler: (level: number) => {
        if (level === subscribeLevels.ECONOMY) {
            return "ЭКОНОМ"
        }
        if (level === subscribeLevels.STANDARD) {
            return "СТАНДАРТ"
        }
        if (level === subscribeLevels.EXTENDED) {
            return "РАСШИРЕННЫЙ"
        }
        if (level === subscribeLevels.ABSOLUTE) {
           return "АБСОЛЮТ"
        }
    }
})

const setShowSubscribeModalFX = createEffect({
        handler: (level: number) => {
            const current_subscribe = $subscribe.getState();
            if (current_subscribe) {
                //@ts-ignore
                return level > current_subscribe?.subscribe?.level.id;
            } else {
                return true
            }
        }
    }
);

const $acceptSubscribe = createStore<string>("")
    .on(acceptSubscribeFX.doneData, (_, level) => level)


const setShowSubscribeMaxCountOfApplicationsModal = createEvent<boolean>();

const setShowSubscribeMaxCountOfApplicationsModalFX = createEffect({
    handler: () => {
        const current_subscribe = $subscribe.getState();
        const auth = $authStore.getState();
        if (current_subscribe) {
            //@ts-ignore
            return current_subscribe?.subscribe?.counter <= auth.user?.company?.totalApplicationsCount;
        } else {
            return true
        }
    }
})

const setShowSubscribeMaxCountOfStaffModal = createEvent<boolean>();
const setShowSubscribeMaxCountOfStaffModalFX = createEffect({
    handler: () => {
        const current_subscribe = $subscribe.getState();
        const auth = $authStore.getState();
        if (current_subscribe) {
            //@ts-ignore
            return current_subscribe?.subscribe?.staffCount <= auth.user?.company?.staff.length;
        } else {
            return true
        }
    }
})

//НУЖНО ЧТОБЫ ХОЗЯИН ФИРМЫ НЕ СМОГ ДОБАВЛЯТЬ НОВЫХ СОТРУДНИКОВ СВЕРХ ПОДПИСКИ
const $showSubscribeMaxStaffCountModal = createStore<boolean>(false)
    .on(setShowSubscribeMaxCountOfStaffModalFX.doneData, (_, visible) => visible)
    .on(setShowSubscribeMaxCountOfStaffModal, (_, visible) => visible)


const $showSubscribeModal = createStore<boolean>(false)
    .on(setShowSubscribeModalFX.doneData, (_, visible) => visible)
    .on(setShowSubscribeModal, (_, visible) => visible)

const $showSubscribeMaxCountModal = createStore<boolean>(false)
    .on(setShowSubscribeMaxCountOfApplicationsModalFX.doneData, (_, visible) => visible)
    .on(setShowSubscribeMaxCountOfApplicationsModal, (_, visible) => visible)


export {
    $showSubscribeModal,
    setShowSubscribeModal,
    setShowSubscribeModalFX,
    setShowSubscribeMaxCountOfApplicationsModalFX,
    setShowSubscribeMaxCountOfApplicationsModal,
    $showSubscribeMaxCountModal,
    $acceptSubscribe,
    acceptSubscribeFX,
    setShowSubscribeMaxCountOfStaffModal,
    $showSubscribeMaxStaffCountModal,
    setShowSubscribeMaxCountOfStaffModalFX,
}