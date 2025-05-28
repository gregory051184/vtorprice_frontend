import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import React from "react";
import {getRecyclablesByCategoryIdFx} from "@box/entities/recyclable/model";
import {RecyclablesWasteSellByCategory} from "@box/pages/recyclables/ui/waste/sell/recyclables";

const Index = () => <RecyclablesWasteSellByCategory/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getRecyclablesByCategoryIdFx, {scope, params: context?.params?.id || 0});
});

export default Index;