import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import React from "react";
import {getRecyclableFx} from "@box/entities/recyclable/model";
import {ApplicationsAndCompaniesByRecyclableWasteSell} from "@box/pages/recyclables/ui/waste/sell/recyclable";

const Index = () => <ApplicationsAndCompaniesByRecyclableWasteSell/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getRecyclableFx, {scope, params: context?.params?.id || 0});
});

export default Index;