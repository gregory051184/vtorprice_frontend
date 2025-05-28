import React from 'react';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import {getProposalFx} from "@box/pages/profile/proposals/proposal";
import { EquipmentProposalPage } from '@box/pages/profile/profile-equipment-proposal';
import {getEquipmentProposalFx} from "@box/pages/profile/equipment_proposals";


const Index = () => <EquipmentProposalPage />;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   context,
                                                                                   scope,
                                                                               }) => {
    if (context?.params?.id) {
        await allSettled(
            getEquipmentProposalFx,
            { scope, params: parseInt(context.params.id as string, 10) }
        );
    }
});

export default Index;
