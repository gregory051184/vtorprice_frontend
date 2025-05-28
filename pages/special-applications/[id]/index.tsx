import React from 'react';
import { allSettled } from 'effector';
import { withServerSideAuth } from '@box/providers';
import {SpecialApplication} from "@box/pages/special-applications/special_application/ui/application";
import {getSpecialApplicationFx} from "@box/entities/special-application";

function Index() {
    return <SpecialApplication />;
}

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(getSpecialApplicationFx, { scope, params: context?.params?.id || 0 });
});

export default Index;
