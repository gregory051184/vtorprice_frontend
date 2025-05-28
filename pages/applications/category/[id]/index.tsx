import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import React from "react";
import {RecyclablesByCategory} from "@box/pages/recyclables/ui";
import {getRecyclablesByCategoryIdFx} from "@box/entities/recyclable/model";

const Index = () => <RecyclablesByCategory/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getRecyclablesByCategoryIdFx, {scope, params: context?.params?.id || 0});
});

export default Index;