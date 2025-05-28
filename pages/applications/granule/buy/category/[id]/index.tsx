import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import React from "react";
import {getRecyclablesByCategoryIdFx} from "@box/entities/recyclable/model";
import {RecyclablesGranuleBuyByCategory} from "@box/pages/recyclables/ui/granule/buy/recyclables";

const Index = () => <RecyclablesGranuleBuyByCategory/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getRecyclablesByCategoryIdFx, {scope, params: context?.params?.id || 0});
});

export default Index;