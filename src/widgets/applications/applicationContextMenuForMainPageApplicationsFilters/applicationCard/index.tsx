import s from "@box/widgets/recyclableCategories/ui/styles.module.scss";
import React, {useEffect, useState} from "react";
import {IRecyclableApplicationPrice} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {IRecyclableApplication, IRecyclableApplicationShortForAll} from "@box/entities/application/model";
import {useRouter} from "next/router";
import {useStore} from "effector-react";
import {applicationType} from "@box/features/map/filters/applications/model";
import {useField, useForm} from "@box/shared/effector-forms";
import {filters} from "@box/features/recyclable/filters/exchnageRecyclables/model";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {useScreenSize} from "@box/shared/hooks";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";


type ApplicationCardForContextPanelType = {
    fraction: IRecyclableApplicationPrice;
    applications: IRecyclableApplicationShortForAll[]//IRecyclableApplication[];
    priceFrom: string;
    priceTo: string;
    volumeFrom: string;
    volumeTo: string;
}

export const ApplicationCardForContextPanel: React.FC<ApplicationCardForContextPanelType> = ({
                                                                                                 fraction,
                                                                                                 applications,
                                                                                                 priceFrom,
                                                                                                 priceTo,
                                                                                                 volumeFrom,
                                                                                                 volumeTo
                                                                                             }) => {
    const router = useRouter();
    const type = useStore(applicationType);
    const {fields} = useForm(mainMenuApplicationFilters);
    const f = useForm(applicationFiltersForMainPageChart);
    const [showContextMenu, setShowContextMenu] = useState<number>(0);
    const [close, setClose] = useState<boolean>(true);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const {value, onChange} = useField(filters.fields.urgency_type);

    const priceStatistics = (fractionId: number) => {
        const currentApp = applications
            .filter(application => application.recyclables.id === fractionId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(application => application.price)
        const devPercent = +((currentApp[0] - currentApp[currentApp.length - 1]) / currentApp[currentApp.length - 1] * 100).toFixed(2);
        let deviation = "";
        if (devPercent) {
            switch (true) {
                case devPercent > 0:
                    deviation = `▲ ${Math.abs(devPercent)}%`;
                    break;
                case devPercent < 0:
                    deviation = `▼ ${Math.abs(devPercent)}%`;
                    break;
                default:
                    deviation = `▼ ${Math.abs(devPercent)}%`;
            }
        } else {
            deviation = '--';
        }
        const min_price = Math.min(...applications
            .filter(app => app.recyclables.id === fractionId)
            .map(app => app.price));
        const max_price = Math.max(...applications
            .filter(app => app.recyclables.id === fractionId)
            .map(app => app.price));
        return {
            max_price: max_price,
            min_price: min_price,
            price_rising: deviation
        }
    };
    useEffect(() => {
    }, [fraction, applications]);
    return (
        <div>
            <div
                onClick={() => {
                    setClose(!close);
                    setShowContextMenu(fraction?.id);
                }}
                className={s.sample}
                style={{color: !close && showContextMenu === fraction?.id ? 'rgba(67, 158, 126)' : 'white'}}
                key={fraction?.id}
            >{fraction.name}</div>
            {(!close && showContextMenu === fraction?.id) &&
                <div>
                    {applications
                        .filter(app => app.recyclables.id === fraction.id)
                        .length > 0 && priceStatistics(fraction?.id).min_price ?
                        <div className="mb-5 text-white">
                            {priceStatistics(fraction?.id).price_rising ?
                                <span>{`Изменение цены: ${priceStatistics(fraction?.id).price_rising}`}</span> :
                                <span>{`Изменение цены: --`}</span>
                            }
                            <span>{' | '}</span>
                            <span>{`Мин. цена: ${priceStatistics(fraction?.id).min_price} ₽`}</span>
                            <span>{' | '}</span>
                            <span>{`Макс. цена: ${priceStatistics(fraction?.id).max_price} ₽`}</span>
                        </div> :
                        <div className="mb-5 text-white">
                            <p>Объявления по данной фракции пока
                                отсутствуют...</p>
                        </div>
                    }
                    <div className={s.context_menu_in_filter_panel}>
                        <div className="mb-5">
                            <p className="text-black cursor-pointer"
                               onClick={() => router
                                   .push(`/applications?application_type=${+type?.id}&application_recyclable_status=${fields.application_recyclable_status?.value?.id}&urgency_type=${value?.id}&deal_type=${fields.deal_type_tab?.value?.id}&category=${fraction?.id}&category_name=${fraction.name}&period=${f.fields.period_tab?.value?.label}&total_weight__gte=${volumeFrom}&total_weight__lte=${volumeTo}&price__gte=${priceFrom}&price__lte=${priceTo}`)}
                            >
                                {`К объявлениям по ${fraction?.name}`}
                            </p>
                            <p
                                className={s.context_menu_item_in_filter_panel}
                                onClick={() => router.push('/map')}
                            >
                                {`К статистике по ${fraction?.name}`}
                            </p>
                            <p
                                className={s.context_menu_item_in_filter_panel}
                                onClick={() => router.push('/map')}
                            >
                                {`Разослать предложения по ${fraction?.name}`}
                            </p>
                        </div>
                        <div className={!isMobile ? "ml-5" : ""}>
                            <p
                                className="text-black cursor-pointer"
                                onClick={() => router.push('/map')}
                            >
                                {`К избранному по ${fraction.name}`}
                            </p>
                            <p
                                className={s.context_menu_item_in_filter_panel}
                                onClick={() => router
                                    //@ts-ignore
                                    .push(`/map?application_type=${+type?.id}&urgency_type=${value?.id}&application_recyclable_status=${fields.application_recyclable_status?.value?.id}&deal_type=${fields.deal_type_tab?.value?.id}&period=${f.fields.period_tab?.value?.label}&category=${fraction?.id}&volume=${volumeFrom}&city=${fields.applications__city?.value?.id}`)}>
                                {`На карте предложения ${fraction?.name}`}
                            </p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}