import s from "@box/pages/home/style.module.scss";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";
import {CompanyRowForCompaniesPanelType} from "@box/entities/company/ui/rows/companyRowForCompaniesPanel/types";
import {useForm} from "@box/shared/effector-forms";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";


export const CompanyRowForCompaniesPanel: React.FC<CompanyRowForCompaniesPanelType> = ({
                                                                                           recyclableCategory,
                                                                                           recyclables
                                                                                       }) => {

    const {fields} = useForm(mainMenuApplicationFilters);
    const router = useRouter();

    const [showContextMenu, setShowContextMenu] = useState<number>(0);
    const [close, setClose] = useState<boolean>(true);


    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const showFractionsHandler = (categoryId: number) => {
        if (fields.search?.value.length === 0) {
            return recyclables.filter(recyclable =>
                recyclable.category === categoryId
            )
        } else {
            return recyclables.filter(recyclable =>
                recyclable.name.indexOf(fields.search?.value) > -1
            )
        }
    }
    return (
        <div>
            <h2 className="text-white">{recyclableCategory?.name}</h2>
            {showFractionsHandler(recyclableCategory?.id).map((fraction) => (
                <div>
                    <div
                        onClick={() => {
                            setClose(!close);
                            setShowContextMenu(fraction?.id);
                            //Меняем стор для recyclable чтобы можно использовать на след. страницах, но в category будет передаваться fraction.id
                            //fetchRecyclable(fraction.id);
                        }}
                        className={s.sample}
                        style={{color: !close && showContextMenu === fraction?.id ? 'rgba(67, 158, 126)' : 'white'}}
                        key={fraction.id}
                    >{fraction.name}</div>
                    {(!close && showContextMenu === fraction?.id) &&
                        <div
                            className={s.context_menu_in_filter_panel}
                        >
                            <div className="mb-5">
                                <p
                                    className="text-black cursor-pointer"
                                    onClick={() => router
                                        .push(`/companies/main?city=${fields?.city?.value?.id}&category=${fraction?.id}&category_name=${fraction.name}&deal_type=${fields.deal_type_tab?.value?.id}&period=${fields.period_tab?.value?.label}&company_status=${fields.companies_trust?.value?.id}&company_rating=${fields.company_rating?.value?.id}`)}
                                >
                                    {`К компаниям по ${fraction?.name}`}
                                </p>
                                <p
                                    className="text-black cursor-pointer mt-3"

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
                            <div className="ml-5">
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
                                        .push(`/map?`)}>
                                    {`На карте предложения ${fraction?.name}`}
                                </p>
                            </div>
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}