import s from "@box/pages/subscribe/list/ui/styles.module.scss";
import React from "react";
import {SubscribeCategoryListRowType} from "@box/entities/subscribe/ui/types/types";
import { SubscribeCategoryRow } from "./subscribeCategoryRow";


export const SubscribeCategoryListRow: React.FC<SubscribeCategoryListRowType> = ({
                                                                                     subscribeCategories,
                                                                                     subscribe,
                                                                                 }) => {
    return (
        <div className={s.subscribes_list}>
            <h3 className="mt-5 font-bold">{`Тариф ${subscribeCategories[0]?.name}`}</h3>
            {subscribeCategories.map(element => (
                <SubscribeCategoryRow subscribeCategory={element} subscribe={subscribe} key={element.id}/>))}
        </div>
    )
}