import React, {useState} from "react";
import s from "@box/widgets/recyclableCategories/ui/styles.module.scss";
import {useRouter} from "next/router";
import {useStore} from "effector-react";
import {applicationType} from "@box/features/map/filters/applications/model";
import {useForm} from "@box/shared/effector-forms";
import {mainMenuApplicationFilters} from "@box/features/application";

type IEquipment = {
    id: number,
    label: string,
    value: number
}

type EquipmentApplicationContextMenuForMainPageApplicationsFiltersType = {
    equipment: IEquipment
}

export const EquipmentApplicationContextMenuForMainPageApplicationsFilters: React.FC<EquipmentApplicationContextMenuForMainPageApplicationsFiltersType> = ({
                                                                                                                                                               equipment
                                                                                                                                                           }) => {
    const router = useRouter();
    const type = useStore(applicationType);
    const {fields} = useForm(mainMenuApplicationFilters);
    const [showContextMenu, setShowContextMenu] = useState<number>(0);
    const [close, setClose] = useState<boolean>(true);
    return (
        <div>
            <div
                onClick={() => {
                    setClose(!close);
                    setShowContextMenu(equipment?.id);
                }}
                className={s.sample}
                style={{color: !close && showContextMenu === equipment?.id ? 'rgba(67, 158, 126)' : 'white'}}
                key={equipment.id}
            >{equipment.label}</div>
            {(!close && showContextMenu === equipment?.id) &&
                <div className={s.context_menu_in_filter_panel}>
                    <div className="mb-5">
                        <p
                            className="text-black cursor-pointer"
                            //@ts-ignore
                            onClick={() => router.push(`/applications/equipments?application_type=${+type?.id}&deal_type=${fields.deal_type_tab?.value?.id}&category=${equipment?.id}&period=${fields.period_tab?.value?.label}&city=${fields.applications__city?.value?.id}`)}
                        >
                            {`К предложениям по ${equipment.label}`}
                        </p>
                        <p
                            className={s.context_menu_item_in_filter_panel}
                            //@ts-ignore
                            onClick={() => router.push(`/map?application_type=${+type?.id}&deal_type=${fields.deal_type_tab?.value?.id}&category=${equipment?.id}&period=${fields.period_tab?.value?.label}&city=${fields.applications__city?.value?.id}`)}
                        >
                            {`К статистике по ${equipment.label}`}
                        </p>
                        <p
                            className={s.context_menu_item_in_filter_panel}
                            onClick={() => router.push('/map')}
                        >
                            {`Разослать предложения по ${equipment.label}`}
                        </p>
                    </div>
                    <div style={{/*marginLeft: '20px'*/}} className="ml-5">
                        <p
                            className="text-black cursor-pointer"
                            onClick={() => router.push('/map')}
                        >
                            {`К избранному по ${equipment.label}`}
                        </p>
                        <p
                            className={s.context_menu_item_in_filter_panel}
                            onClick={() => router.push(`/map?`)}
                        >
                            {`На карте предложения ${equipment.label}`}
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}