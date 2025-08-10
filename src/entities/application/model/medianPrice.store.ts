import {createEffect, createEvent, sample} from "effector";
import {applicationApi} from "@box/entities/application";
import {AxiosError} from "axios";



const medianContractsPriceEvent = createEvent<Parameters<typeof applicationApi.getMedianContractsPrice>[0]>();

const medianContractsPriceFx = createEffect<
    Parameters<typeof applicationApi.getMedianContractsPrice>[0],
    number[],
    AxiosError>({
    handler: async (params) => {
        const {data} = await applicationApi.getMedianContractsPrice(params)
        const main_data = data.map(item => item.price)
        return main_data
    }
});

sample({
    clock: medianContractsPriceEvent,
    target: medianContractsPriceFx
})


export {
    medianContractsPriceFx,
    medianContractsPriceEvent
}