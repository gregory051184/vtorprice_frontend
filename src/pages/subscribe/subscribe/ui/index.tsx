import {BackButton, Container} from "@box/shared/ui";
import {useEvent, useGate, useStore} from "effector-react";
import {$subscribe, subscribeForm, subscribeGate} from "@box/entities/subscribe";
import React from "react";
import {Button} from "@mantine/core";
import {useForm} from "@box/shared/effector-forms";
import {createSubscribeEvent} from "@box/features/subscribe";
import s from './styles.module.scss';

export const Subscribe = () => {

    const subscribe = useStore($subscribe);
    const {
        fields, submit, isValid,
        hasError, reset
    } = useForm(subscribeForm);

    const subscribeEvent = useEvent(createSubscribeEvent);

    const subscribeBuyHandler = (level: number) => {
        fields.level.onChange(level);
        submit();
        subscribeEvent();
        return
    }

    useGate(subscribeGate);

    return (
        <Container>
            <BackButton/>
            <div className="mt-6 h-auto">
                <div className={s.subscribe}>
                    <div>
                        <p>{subscribe?.subscribe?.name}</p>
                    </div>
                    <div>
                        <p>{subscribe?.subscribe?.price}</p>
                    </div>
                    <div>
                        <p>{subscribe?.subscribe?.description}</p>
                    </div>
                </div>

                <Button onClick={() =>
                    //Нужно будет перекидывать на оплату!!!
                    //@ts-ignore
                    subscribeBuyHandler(subscribe?.level)}>
                </Button>
            </div>
        </Container>
    )
}