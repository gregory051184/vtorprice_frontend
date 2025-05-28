import {ISubscribe, ISubscribeCategory} from "@box/entities/subscribe";

export type SubscribeCategoryListRowType = {
    subscribeCategories: ISubscribeCategory[];
    subscribe: ISubscribe;
}

export type SubscribeCategoryRowType = {
    subscribeCategory: ISubscribeCategory;
    subscribe: ISubscribe;
}