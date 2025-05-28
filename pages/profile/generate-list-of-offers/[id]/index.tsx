import {StockGlassOffer} from "@box/pages/profile/generate-list-of-offers/glass";
import {withServerSideAuth} from "@box/providers";
import {allSettled} from "effector";
import {dealsForOffersModel} from "@box/entities/generate-list-of-offers";

const Index = () =>
    <StockGlassOffer/>


export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context
                                                                               }) => {
    if (context.params?.id) {
    //@ts-ignore
    await allSettled(dealsForOffersModel.getDealForOffersFx, {
        scope,
        params: {id: context.params?.id},
    });
    }
});
export default Index