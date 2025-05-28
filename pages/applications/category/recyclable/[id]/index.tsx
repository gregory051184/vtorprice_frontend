import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import {getRecyclableFx} from "@box/entities/recyclable/model";
import React from "react";
import {ApplicationsAndCompaniesByRecyclable} from "@box/pages/recyclables/ui/recyclable";

const Index = () => <ApplicationsAndCompaniesByRecyclable/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getRecyclableFx, {scope, params: context?.params?.id || 0});
});

export default Index;