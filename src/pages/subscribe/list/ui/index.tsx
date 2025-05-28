import {BackButton, Container} from "@box/shared/ui";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import React, {useEffect} from "react";
import {AppShell} from "@box/layouts";
import {useGate, useStore} from "effector-react";
import {
    $subscribe,
    $subscribesCategories,
    gate,
    SubscribeCategoryListRow,
    subscribeGate
} from "@box/entities/subscribe";
import {subscribePeriod} from "@box/pages/subscribe/lib/types";
import {SubscribeInfo} from "@box/widgets/subscribe-info";
import {useRouter} from "next/router";



export const Subscribes = () => {

    const router = useRouter();
    const subscribes = useStore($subscribesCategories);
    const subscribe = useStore($subscribe);

    const subscribesGroupHandler = () => {
        const groups = [];

        for (let i = 0; i < subscribePeriod.length; i += 1) {
            const group = subscribes.filter(subscribe => subscribePeriod[i].id === subscribe.level.id);
            groups.push(group);
        }
        return groups;
    };

    useGate(gate);

    useGate(subscribeGate);

    useEffect(() => {
    }, [subscribes, subscribe]);

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Container>
                <BackButton/>

                {subscribe ?
                    //@ts-ignore
                    <SubscribeInfo subscribe={subscribe}></SubscribeInfo> :
                    <h3
                        className="cursor-pointer"
                        onClick={() => router.push('/subscribes/')}>
                        У Вас нет подписки
                    </h3>
                }
                {
                    subscribes && subscribesGroupHandler().map(sub => (
                        //@ts-ignore
                        <SubscribeCategoryListRow subscribe={subscribe} subscribeCategories={sub} key={sub.id}/>))}
            </Container>
        </AppShell>
    )
}