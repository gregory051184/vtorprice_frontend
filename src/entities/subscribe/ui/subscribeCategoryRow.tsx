import s from "@box/pages/subscribe/list/ui/styles.module.scss";
import React from "react";
import {SubscribeCategoryRowType} from "@box/entities/subscribe/ui/types";
import {useEvent, useStore} from "effector-react";
import {createSubscribeEvent} from "@box/features/subscribe";
import {subscribeForm} from "@box/entities/subscribe";
import {$authStore} from "@box/entities/auth";

export const SubscribeCategoryRow: React.FC<SubscribeCategoryRowType> = ({
                                                                             subscribeCategory,
                                                                             subscribe
                                                                         }) => {
    const createSubscribe = useEvent(createSubscribeEvent);
    const user = useStore($authStore);
    const {fields, submit, reset} = subscribeForm;
    const createSubscribeCreateHandler = (level_id: number, period_id: number) => {
        //@ts-ignore
        fields.company.onChange(user.user?.company.id);
        fields.level.onChange(level_id);
        fields.period.onChange(period_id);
        createSubscribe();
        submit();
    }

    return (
        <div
            className={s.subscribe_card}
        >
            <div className="p-4 max-w-screen-sm min-w-[440px]">
                <h3 className={s.subscribe_title}>
                    {subscribe?.subscribe?.id === subscribeCategory?.id ? `${subscribeCategory?.name} ПРИОБРЕТЕНО` : subscribeCategory?.name}
                </h3>
                <div className="inline-flex">
                    <div className={s.subscribe_description}>
                        <p>
                            {subscribeCategory.description}
                        </p>
                    </div>
                    <div className={s.subscribe_price}>
                        <p className="mt-2 text-white text-2xl">
                            {`${subscribeCategory?.price} ₽`}
                        </p>
                        <p className="mt-2 text-white text-2xl">
                            {subscribeCategory?.name.split('+')[1] ? `За ${subscribeCategory?.name.split('+')[1]} мес.` : 'За 1 мес.'}
                        </p>
                        <div className="mt-10">
                            <div
                                className={s.buy_subscribe_button}
                                onClick={() => {
                                    createSubscribeCreateHandler(subscribeCategory.level.id, subscribeCategory.period.id)
                                }}>
                                Оформить
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}