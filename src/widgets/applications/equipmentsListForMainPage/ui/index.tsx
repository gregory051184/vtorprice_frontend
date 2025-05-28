import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import React, {useEffect} from "react";
import {AppShell} from "@box/layouts";
import {Button, Container, Pagination, Table} from "@box/shared/ui";
import {EquipmentsFiltersLayout} from "@box/layouts/filters_layout/ui/equipmentsFilters";
import {useForm} from "@box/shared/effector-forms";
import {useStore} from "effector-react";
import {
    $equipmentApplications,
    equipmentApplicationsLoading,
} from "@box/entities/application/model";
import {useScreenSize} from "@box/shared/hooks";
import classNames from "classnames";
import s from "@box/widgets/applications/applicationsListForMainPage/ui/style.module.scss";
import {DeliveryCalculator, DeliveryCalculatorVertical} from "@box/features";
import {useRouter} from "next/router";
import {
    headers,
    orderingForEquipmentMainPage,
    paginationForEquipmentMainPage
} from "@box/widgets/applications/equipmentsListForMainPage";
import {useOrdering, usePagination} from '@box/shared/lib/factories';
import {IWithClass} from "@types";
import {EquipCard} from "@box/widgets/applications/equipmentsListForMainPage/ui/equipCard";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";

export const EquipmentsListForMainPage: React.FC<IWithClass> = ({
                                                                    className
                                                                }) => {
    const pag = usePagination(paginationForEquipmentMainPage);
    const ord = useOrdering(orderingForEquipmentMainPage);
    const loading = useStore(equipmentApplicationsLoading.$loaderStore);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
    const equipments = useStore($equipmentApplications);
    const {fields, reset} = useForm(mainMenuApplicationFilters);
    const router = useRouter();

    useEffect(() => {
    }, [equipments]);

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <EquipmentsFiltersLayout>
                <Container>
                    {
                        Object.keys(fields).length > 0 &&
                        <div className="mt-6 mb-6 inline-flex flex-wrap">
                            <p className="font-bold whitespace-nowrap">{`Фильтры >> `}</p>
                            {
                                fields.deal_type_select?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.deal_type_select?.value?.label} >`}</p>
                            }
                            {
                                fields.period?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.period?.value?.label} >`}</p>
                            }
                            {
                                fields.city?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.city?.value?.label} >`}</p>
                            }
                            {
                                fields.equipment_category?.value?.label &&
                                <p className="whitespace-nowrap">{`${fields.equipment_category?.value?.label} >`}</p>
                            }
                            {
                                fields.was_in_use?.value?.id === 1 ?
                                    <p className="whitespace-nowrap">{"Без НДС >"}</p> :
                                    <p className="whitespace-nowrap">{"С НДС >"}</p>
                            }
                            {
                                fields.sale_by_part?.value?.id === 1 ?
                                    <p className="whitespace-nowrap">{"Полностью >"}</p> :
                                    <p className="whitespace-nowrap">{"По запчастям >"}</p>
                            }
                            {
                                fields.created_at?.value[0] !== null &&
                                //@ts-ignore
                                <p className="whitespace-nowrap">{`Опубликовано ${new Date(fields.created_at?.value).toLocaleDateString()} >`}</p>
                            }
                            {
                                fields.manufacture_date?.value[0] !== null &&
                                //@ts-ignore
                                <p className="whitespace-nowrap">{`Произведён ${new Date(fields.manufacture_date?.value).toLocaleDateString()} >`}</p>
                            }
                            {
                                fields.price__gte?.value &&
                                <p className="whitespace-nowrap">{`Цена ${fields.price__gte?.value} >`}</p>
                            }
                            {
                                fields.companies_trust?.value?.label &&
                                <p className="whitespace-nowrap">{`Доверие ${fields.companies_trust?.value?.label} >`}</p>
                            }
                            {
                                fields.company_rating?.value?.label &&
                                <p className="whitespace-nowrap">{`Рейтинг ${fields.company_rating?.value?.label} >`}</p>
                            }
                        </div>
                    }
                    <div className="mt-6 mb-6">
                        <h1>{
                            //@ts-ignore
                            fields.equipment_category?.value?.label
                        }</h1>
                    </div>
                    {/*satisfies('md') ? (*/
                        (!isLaptop && !isMobile) &&
                        <Table
                            loading={loading && pag.currentPage === 1}
                            empty={equipments.length === 0}
                            className={classNames(className, s.table)}
                            pagination={<Pagination pagination={paginationForEquipmentMainPage}/>}
                        >
                            <div className="inline-flex">
                                <div>
                                    {equipments.filter(app => app?.equipment.category.id === fields?.equipment_category.value?.id).map((application) => (
                                        <EquipCard equipment={application} key={application.id}/>))}

                                </div>
                                {equipments?.length > 0 &&
                                    <div className={s.ordering_panel}>
                                        <h3 className="text-white">Упорядочить</h3>
                                        <Table.List
                                            headers={headers}
                                            ordering={ord.ordering}
                                            onOrderingChange={ord.setOrdering}
                                        />
                                        <div className="mt-6 ml-5">
                                            <Button onClick={() => router.push('/profile/favorites')}>
                                                Избранное
                                            </Button>
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-white">Перевозка</h3>
                                            <DeliveryCalculatorVertical className="mb-[70px]"/>
                                        </div>
                                    </div>}
                            </div>
                        </Table>}
                    {(!isMobile && isLaptop) &&
                        <div className="mt-6">
                            <DeliveryCalculator className="w-full"></DeliveryCalculator>
                            <div className="mt-6">
                                <Button
                                    fullWidth={true}
                                    mode="light"
                                    onClick={() => router.push('/profile/favorites')}>
                                    Избранное
                                </Button>
                            </div>
                            <div className={isLaptop ? "inline-flex ml-28" : "inline-flex"}>
                                <div>
                                    {equipments.filter(app => app?.equipment.category.id === fields.equipment_category.value?.id).map((application) => (
                                        <EquipCard equipment={application} key={application.id}/>))}
                                </div>
                            </div>
                        </div>
                    }

                    {(isMobile && !isLaptop) &&
                        <div className="mt-6">
                            <DeliveryCalculator className="w-full"></DeliveryCalculator>
                            <div className="mt-6">
                                <Button
                                    fullWidth={true}
                                    mode="light"
                                    onClick={() => router.push('/profile/favorites')}>
                                    Избранное
                                </Button>
                            </div>
                            <div className="inline-flex">
                                <div>
                                    {equipments.filter(app => app?.equipment.category.id === fields.equipment_category.value?.id).map((application) => (
                                        <EquipCard equipment={application} key={application.id}/>))}
                                </div>
                            </div>
                        </div>
                    }
                </Container>
            </EquipmentsFiltersLayout>
            <Container></Container>
            <AppShell/>
        </AppShell>
    )
}