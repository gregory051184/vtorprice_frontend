import {
    AppInput,
    AsyncSelect,
    BlurOverlay,
    Container,
    ITabSelectValue,
    Paper,
    SearchInput,
    TabSelect
} from "@box/shared/ui";
import classNames from "classnames";
import s from "@box/widgets/recyclableCategories/ui/styles.module.scss";
import ModalClose from "@assets/icons/modal_close.svg";
import {CompaniesMainMenuPanel} from "@box/entities/company";
import {
    applicationRecyclableStatusSelectValues,
    applicationTypes, dealTypeSelectValues, TimeframeTypes,
    urgencyTypeSelectValues
} from "@box/entities/application";
import {citySelectApi} from "@box/entities/city";
import {Stepper} from "@box/shared/ui/stepper";
import {
    CreateReadyForShipmentApplicationForm,
    CreateSupplyContractApplicationForm,
} from "@box/features/application";
import {CreateEquipmentForm} from "@box/features/application/forms/create/equipment";
import {NotAuthAlert} from "@box/entities/notAuthAlert/ui";
import React, {useEffect, useRef, useState} from "react";
import {useField, useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {useStore, useUnit} from "effector-react";
import {applicationType, changeApplicationType} from "@box/features/map/filters/applications/model";
import {clearApplicationInList} from "@box/pages/map";
import {filters} from "@box/features/recyclable/filters/exchnageRecyclables/model";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";
import {$recyclablesCategory} from "@box/entities/category/model";
import {$allApplicationsWithoutPages} from "@box/entities/application/model";
import {$recyclablesApplicationsPrices} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {equipmentSelectApi} from "@box/entities/application/api/selects/equipmentSelect";
import {
    ApplicationContextMenuForMainPageApplicationsFilters,
    EquipmentApplicationContextMenuForMainPageApplicationsFilters
} from "@box/widgets/applications/applicationContextMenuForMainPageApplicationsFilters";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";


const formTypes = [
    {
        id: 1,
        label: 'Готово к отгрузке',
        value: 1
    },
    {
        id: 2,
        label: 'Контракт на поставку',
        value: 2
    },
    {
        id: 3,
        label: 'Оборудование',
        value: 3
    },
];


interface IFormsModals {
    showForm: boolean;
    showCompanies: boolean;
    showApplications: boolean;
    onChangeShowForm: (value: any) => void;
    onChangeShowCompanies: (value: any) => void;
    onChangeShowApplications: (value: any) => void;
}

export const FormsModals: React.FC<IFormsModals> = ({
                                                        showForm,
                                                        showCompanies,
                                                        showApplications,
                                                        onChangeShowForm,
                                                        onChangeShowCompanies,
                                                        onChangeShowApplications,
                                                    }) => {
    const recyclableCategories = useStore($recyclablesCategory);
    const recyclables = useStore($recyclablesApplicationsPrices);
    const applications = useStore($allApplicationsWithoutPages);

    const router = useRouter();

    const tabId = Number(router.query.tab) || 0;
    const [selectedFormType, setSelectedFormType] = useState<ITabSelectValue>(formTypes[tabId]);
    const {fields, reset} = useForm(mainMenuApplicationFilters)
    const f = useForm(applicationFiltersForMainPageChart)
    const type = useStore(applicationType);
    const clearSeachApplication = useUnit(clearApplicationInList);
    const changeType = useUnit(changeApplicationType);
    const [appType, setAppType] = useState<number>(+type?.id);
    const {value, onChange} = useField(filters.fields.urgency_type);
    const [priceFrom, setPriceFrom] = useState<string>('');
    const [priceTo, setPriceTo] = useState<string>('');

    const [volumeFrom, setVolumeFrom] = useState<string>('');
    const [volumeTo, setVolumeTo] = useState<string>('');

    const [equipmentCategories, setEquipmentCategories] = useState(Array({id: 0, label: '', value: 0}));

    async function equipments() {
        const result = await equipmentSelectApi()
        return result
    }

    useEffect(() => {
        equipments().then(data => setEquipmentCategories(data))
    }, []);

    const [screenSize, satisfies] = useScreenSize();
    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';


    const changeShowFormHandler = () => {
        onChangeShowForm(false)
    };

    const changeShowCompaniesHandler = () => {
        onChangeShowCompanies(false)
    };

    const changeShowApplicationsHandler = () => {
        onChangeShowApplications(false)
    };

    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showCompanies || !showForm || !showApplications) {
            document.body.style.height = 'auto';
            document.body.style.overflowY = 'auto';
        }
    }, [showForm, showApplications, showCompanies]);

    return (
        <div>

            <BlurOverlay
                visible={showCompanies}
                disableClickOutside
                close={changeShowCompaniesHandler}
                childRef={drawerRef}
            >
                <div
                    className={classNames(
                        "flex items-center mt-6 gap-[14px] cursor-pointer left-[90vw] relative",
                        s.close_button_out
                    )}
                    onClick={() => {
                        changeShowCompaniesHandler()
                    }
                    }
                >
                    <ModalClose/>
                    <p className="font-semibold text-white">Закрыть</p>
                </div>

                <div className='w-1/2 ml-[27vw] mt-16'>
                    <CompaniesMainMenuPanel></CompaniesMainMenuPanel>
                </div>
            </BlurOverlay>
            {showApplications &&
                <BlurOverlay
                    visible={showApplications}
                    disableClickOutside={true}
                    close={() => changeShowApplicationsHandler()}
                    childRef={drawerRef}
                >
                    <div
                        className={classNames(
                            "flex items-center mt-6 gap-[14px] cursor-pointer left-[90vw] relative",
                            s.close_button_out
                        )}
                        onClick={() => changeShowApplicationsHandler()}
                    >
                        <ModalClose/>
                        <p className="font-semibold text-white">Закрыть</p>
                    </div>
                    {type.id === 2 &&
                        <div className='w-1/2 ml-[27vw] mt-20'>
                            <div className={s.filter_panel}>
                                <div className={'fixed w-[350px]'}>
                                    <div className={'w-auto mt-6 mb-6'}>
                                        <h1 className={'text-white'}>Объявления сырьё</h1>
                                    </div>
                                    <div className={'w-auto mt-6'}>
                                        <TabSelect
                                            value={type}
                                            onChange={(val) => {
                                                clearSeachApplication();
                                                changeType(val);
                                                setAppType(+type.id)
                                            }}
                                            values={applicationTypes}
                                        />
                                    </div>
                                    <h4 className={'text-white mt-6'}>Обязательные фильтры</h4>
                                    <div className={'w-auto mt-6'}>
                                        <TabSelect
                                            onChange={f.fields.application_recyclable_status.onChange}
                                            values={applicationRecyclableStatusSelectValues}
                                            value={f.fields.application_recyclable_status.value}
                                        />
                                    </div>
                                    <div className={'w-auto mt-6'}>
                                        <TabSelect

                                            onChange={onChange}
                                            values={urgencyTypeSelectValues}
                                            value={value}
                                        />
                                    </div>
                                    <div className={'w-auto mt-6'}>
                                        <TabSelect
                                            onChange={fields.deal_type_tab.onChange}
                                            values={dealTypeSelectValues}
                                            value={fields.deal_type_tab.value}
                                        />
                                    </div>
                                    <div className={'w-auto mt-6'}>
                                        <TabSelect
                                            onChange={f.fields.period_tab.onChange}
                                            values={TimeframeTypes}
                                            value={f.fields.period_tab.value}
                                        />

                                    </div>
                                    <h4 className={'text-white mt-12'}>Рекомендуемые фильтры</h4>
                                    <div className={'inline-flex mt-6'}>
                                        <div>
                                            <AppInput placeholder={'Цена за кг от'} value={priceFrom}
                                                      onChange={(val) => setPriceFrom(val)}></AppInput>
                                        </div>
                                        <div className={'ml-5'}>
                                            <AppInput placeholder={'Цена за кг до'} value={priceTo}
                                                      onChange={(val) => setPriceTo(val)}></AppInput>
                                        </div>
                                    </div>
                                    <div className={'mt-6'}>
                                        <AsyncSelect
                                            placeholder="Город"
                                            inputProps={{mode: 'stroke'}}
                                            withClearButton
                                            onSelect={fields.city.onChange}
                                            value={fields.city.value}
                                            loadData={citySelectApi}
                                        />
                                    </div>
                                    <div className={'mt-6 inline-flex'}>
                                        <div>
                                            <AppInput placeholder={'Объём кг от'} value={volumeFrom}
                                                      onChange={(val) => setVolumeFrom(val)}></AppInput>
                                        </div>
                                        <div className={'ml-5'}>
                                            <AppInput placeholder={'Объём кг до'} value={volumeTo}
                                                      onChange={(val) => setVolumeTo(val)}></AppInput>
                                        </div>
                                    </div>
                                </div>
                                <div className={!isMobile ? "relative left-[47%] w-[600px]" : ""}>
                                    <div className="mt-4 mb-5">
                                        <SearchInput mode="stroke" value={fields.search.value}
                                                     placeholder="Поиск по фракциям вторсырья..."
                                                     className={classNames('max-w-[400px] w-full', s.search)}
                                                     onChange={fields.search.onChange}/>
                                    </div>

                                    {recyclableCategories.length > 0 && recyclableCategories
                                        .filter(recyclableCategory => fields.search?.value.length > 0 ?
                                            recyclableCategory?.name.toLowerCase().indexOf(fields.search?.value.split(' ')[0].toLowerCase()) > -1 : recyclableCategory)
                                        .map((recyclableCategory) => (
                                            <ApplicationContextMenuForMainPageApplicationsFilters
                                                applications={applications}
                                                recyclableCategory={recyclableCategory}
                                                priceFrom={priceFrom}
                                                priceTo={priceTo}
                                                volumeFrom={volumeFrom}
                                                volumeTo={volumeTo}
                                                recyclables={recyclables}
                                                key={recyclableCategory.id}/>))}
                                </div>
                            </div>
                        </div>
                    }

                    {type.id === 1 &&
                        <div className='w-1/2 ml-[27vw] mt-64'>
                            <div className={s.filter_panel}>
                                <div className="relative w-[350px]">
                                    <div className={'w-auto mt-6 mb-6'}>
                                        <h1 className={'text-white'}>Объявления оборудование</h1>
                                    </div>
                                    <div className="w-auto mt-6">
                                        <TabSelect
                                            value={type}
                                            onChange={(val) => {
                                                clearSeachApplication();
                                                changeType(val);
                                                setAppType(+type?.id)
                                            }}
                                            values={applicationTypes}
                                        />
                                    </div>
                                    <h4 className="text-white mt-6">Обязательные фильтры</h4>
                                    <div className="w-auto mt-6">
                                        <div>
                                            <TabSelect
                                                onChange={fields.period_tab.onChange}
                                                values={TimeframeTypes}
                                                value={fields.period_tab.value}
                                            />

                                        </div>
                                        <div className='mt-6'>
                                            <TabSelect
                                                onChange={fields.deal_type_tab.onChange}
                                                values={dealTypeSelectValues}
                                                value={fields.deal_type_tab.value}
                                            />
                                        </div>
                                    </div>
                                    <h4 className="text-white mt-12">Рекомендуемые фильтры</h4>
                                    <div className="mt-6">
                                        <AsyncSelect
                                            placeholder="Город"
                                            inputProps={{mode: 'stroke'}}
                                            withClearButton
                                            onSelect={fields.city.onChange}
                                            value={fields.city.value}
                                            loadData={citySelectApi}
                                        />
                                    </div>

                                </div>
                                <div className={!isMobile ? "relative w-[600px] left-[10%]" : ""}>
                                    <div className="mt-5">
                                        {equipmentCategories.length > 0 &&
                                            equipmentCategories.map(equipment => (
                                                <EquipmentApplicationContextMenuForMainPageApplicationsFilters
                                                    equipment={equipment}
                                                    key={equipment.id}/>))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </BlurOverlay>
            }
            {
                showForm &&
                <BlurOverlay
                    visible={showForm}
                    disableClickOutside={false}
                    close={() => changeShowFormHandler()}
                    childRef={drawerRef}
                >
                    <div
                        className={classNames(
                            "flex items-center mt-6 gap-[14px] cursor-pointer left-[90vw] relative",
                            s.close_button_out
                        )}
                        onClick={() => changeShowFormHandler()}
                    >
                        <ModalClose/>
                        <p className="font-semibold text-white">Закрыть</p>
                    </div>
                    <div>
                        <Container className="mt-[28px]">
                            <div className={classNames('flex items-center gap-6', s.head)}>
                                <h1 className="font-normal text-2xl">Создать заявку</h1>
                                <TabSelect onChange={setSelectedFormType} values={formTypes}
                                           value={selectedFormType}/>
                            </div>
                            <Paper className="mt-[28px]">
                                <Stepper currentStep={selectedFormType.value}>
                                    <Stepper.Step>
                                        <CreateReadyForShipmentApplicationForm/>
                                    </Stepper.Step>
                                    <Stepper.Step>
                                        <CreateSupplyContractApplicationForm/>
                                    </Stepper.Step>
                                    <Stepper.Step>
                                        <CreateEquipmentForm/>
                                    </Stepper.Step>
                                </Stepper>
                            </Paper>
                        </Container>
                        <NotAuthAlert/>
                    </div>
                </BlurOverlay>
            }
        </div>
    )
}