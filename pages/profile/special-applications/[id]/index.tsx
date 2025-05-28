import React from 'react';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import { UsersSpecialApplication } from '@box/pages/profile/special-application/application';
import {getSpecialApplicationFx} from "@box/entities/special-application";

const Index = () => <UsersSpecialApplication />;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   context,
                                                                                   scope,
                                                                               }) => {
    if (context?.params?.id) {
        await allSettled(
            getSpecialApplicationFx,
            { scope, params: parseInt(context.params.id as string, 10) }
        );
    }
});

export default Index;