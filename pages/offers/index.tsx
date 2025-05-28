import {ApplicationsOffersForCompany} from "@box/pages/offers";
import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import { applicationsForOffersModel } from "@box/entities/app-offer";

const Index = () => <ApplicationsOffersForCompany/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context
                                                                               }) => {
        //@ts-ignore
        await allSettled(applicationsForOffersModel.getApplicationsForOfferFx, {
            scope,
            params: {
                company_id: context.query?.company_id,
                recyclable_id: context.query?.recyclable_id
            },
        });

});

export default Index;
