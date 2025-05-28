import React from 'react';
import {withServerSideAuth} from '@box/providers';
import {allSettled} from 'effector';
import {getProposalForCompaniesFx} from "@box/pages/profile/proposals/proposal";
import {ProposalPageForCompanies} from "@box/pages/profile/profile-proposal/proposal_page";


const Index = () => <ProposalPageForCompanies/>;

/*export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   context,
                                                                                   scope,
                                                                               }) => {
    if (context?.params?.id) {
        await allSettled(
            getProposalForCompaniesFx,
            {scope, params: parseInt(context.params.id as string, 10)}
        );
    }
});*/

export default Index;