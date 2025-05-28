import React from "react";
import {EquipmentProposalPageForCompanies} from "@box/pages/profile/profile-equipment-proposal";

const Index = () => <EquipmentProposalPageForCompanies/>;

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