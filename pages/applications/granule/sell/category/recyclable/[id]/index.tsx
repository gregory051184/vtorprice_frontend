import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import React from "react";
import {getRecyclableFx} from "@box/entities/recyclable/model";
import {ApplicationsAndCompaniesByRecyclableGranuleSell} from "@box/pages/recyclables/ui/granule/sell/recyclable";

const Index = () => <ApplicationsAndCompaniesByRecyclableGranuleSell/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getRecyclableFx, {scope, params: context?.params?.id || 0});
});

export default Index;