import React from 'react';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import {ProposalPage} from '@box/pages/profile/profile-proposal/proposal/ui';
import {getProposalFx} from "@box/pages/profile/proposals/proposal";


const Index = () => <ProposalPage />;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   context,
                                                                                   scope,
                                                                               }) => {
    if (context?.params?.id) {
        await allSettled(
            getProposalFx,
            { scope, params: parseInt(context.params.id as string, 10) }
        );
    }
});

export default Index;
