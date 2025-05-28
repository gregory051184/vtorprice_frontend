import {useGate, useStore} from "effector-react";
import {applicationRecyclableStatusSelectValues, TimeframeTypes} from '@box/entities/application';
import {gate as recyclableGate} from '@box/widgets/statistics/recyclables-applications-prices';
import React, {useEffect, useState} from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    $recyclablesApplicationsPrices
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import {ICompanyShortForAll} from "@box/entities/company/model";
import {
    $allApplicationsWithoutPages,
    IRecyclableApplicationShortForAll
} from "@box/entities/application/model";
import {$recyclablesCategory, gate as categoryGate} from "@box/entities/category/model";
import {Button, Container, Select, TabSelect} from "@box/shared/ui";
import {useScreenSize} from "@box/shared/hooks";
import ReactECharts from "echarts-for-react";
import s from './style.module.scss';
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {forMainPageStatisticsGate} from "@box/widgets/applications/applicationsListForMainPage/model";
import {CompaniesCardForStatistics} from "@box/entities/company";
import {
    applicationsWithPeriodWithoutPagesGate
} from "@box/widgets/applications/applicationsAllWithoutPagesList/model/store";
import {NewLandingStats} from "@box/widgets/landing/landingStats/ui/newLandingStats";


interface ISubCategoriesForChart {
    name: string,
    value: number,
    companies: Array<ICompanyShortForAll>//Array<ICompany>,
    price: number,
}

interface IUniversal {
    name: string,
    id: number,
    value: number
}


export const MainRecyclableBarChart = () => {
    //НОВОЕ
    const recyclables = useStore($recyclablesApplicationsPrices);
    const recyclablesCategory = useStore($recyclablesCategory);
    const [subCategory, setSubCategory] = useState<IUniversal>({name: '', id: 0, value: 0});
    const [category, setCategory] = useState<IUniversal>({name: '', id: 0, value: 0});

    const f = useForm(applicationFiltersForMainPageChart);

    const showFractionsHandler = (categoryId?: number) => {
        if (categoryId && categoryId > 0) {
            return recyclables.filter(recyclable =>
                recyclable.category === categoryId
            ).map(cat => ({
                name: cat.name,
                value: +applications
                    .filter(app =>
                        //@ts-ignore
                        app.recyclables.id === cat.id)
                    .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                    .reduce((sum, a) => sum + a, 0).toFixed(1),
                id: cat.id

            }))
        } else {

            return recyclables.map(cat => ({
                name: cat.name,
                value: +applications
                    .filter(app =>
                        //@ts-ignore
                        app.recyclables.id === cat.id)
                    .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                    .reduce((sum, a) => sum + a, 0).toFixed(1),
                id: cat.id
            }))
        }
    }


    //для получения категорий для графиков
    const dataCategories = (applications: IRecyclableApplicationShortForAll[]/*IRecyclableApplication[]*/) => {
        const list = []
        for (let i = 0; i < recyclablesCategory.length; i++) {
            const category = {
                value: 0,
                name: recyclablesCategory[i]?.name,
                id: recyclablesCategory[i]?.id,
            }
            for (let j = 0; j < applications.length; j++) {
                if (!list.map(elem => elem.id).includes(category.id)) {
                    if (applications[j].recyclables?.category?.id === recyclablesCategory[i]?.id) {
                        category.value += +(applications[j].totalWeight / 1000).toFixed(1)/*applications[j].totalPrice ? applications[j].totalPrice : applications[j].price * applications[j].volume*/
                    }
                }
            }
            list.push(category);
        }
        return list;
    }
    //_______________________________________________

    //const applications = useStore(applicationModel.$applications);

    const applications = useStore($allApplicationsWithoutPages);

    const [companyType, setCompanyType] = useState<string>('');

    const [typeOFDeal, setTypeOFDeal] = useState<string>('');

    const {fields} = useForm(applicationFiltersForMainPageChart);

    //для составления списка компаний по типам активности
    const companies = (apps: IRecyclableApplicationShortForAll[]/*applicationModel.IRecyclableApplication[]*/, subCategoryId: number) => {

        const list: Array<ISubCategoriesForChart> = [
            {name: 'Переработчик', value: 0, companies: [], price: 0},
            {name: 'Сборщик', value: 0, companies: [], price: 0},
            {name: 'Покупатель', value: 0, companies: [], price: 0}
        ];

        const comp = apps
            //@ts-ignore
            .filter(app => app.recyclables?.id === subCategoryId)
        for (let j = 0; j < comp.length; j++) {
            if (comp[j].dealType?.id === BuyOrSellDeals.BUY
                && comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[2].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[2].value += 1;
                list[2].companies.push(comp[j].company);
                list[2].price = +apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.BUY && app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                    .reduce((sum, a) => sum + a, 0).toFixed(1);
            }

            if (comp[j].dealType?.id === BuyOrSellDeals.SELL
                && comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[0].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[0].value += 1;
                list[0].companies.push(comp[j].company);
                list[0].price = +apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.SELL && app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                    .reduce((sum, a) => sum + a, 0).toFixed(1);
            }
            if (comp[j].dealType?.id === BuyOrSellDeals.SELL
                && !comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[1].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[1].value += 1;
                list[1].companies.push(comp[j].company);
                list[1].price = +apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.SELL && !app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                    .reduce((sum, a) => sum + a, 0).toFixed(1);
            }
            if (comp[j].dealType?.id === BuyOrSellDeals.BUY
                && !comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[0].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[0].value += 1;
                list[0].companies.push(comp[j].company);
                list[0].price = +apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.BUY && !app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                    .reduce((sum, a) => sum + a, 0).toFixed(1);
            }
        }
        return list;
    }
    //Получение списка компаний конкретного типа активности
    const currentTypeOfCompanies = (companies: ISubCategoriesForChart[], companyType: string, subCategoryId: number) => {
        //Нужно, чтобы получить тип сделки для передачи в следующий компонент
        const companyId = companies.filter(elem => elem.name === companyType)[0].companies[0]?.id;
        const dealType = applications.filter(app => app.company?.id === companyId)[0].dealType.label;

        for (let i = 0; i < companies.length; i++) {
            if (companies[i].name === companyType) {
                return {
                    companiesList: companies[i].companies, companiesData: companies[i].companies.map(company => ({
                        name: company.name,
                        company_id: company.id,
                        dealType: dealType,
                        isFavorite: company.isFavorite,
                        //Под вопросом способ вычисления средней цены у компании на этот

                        price: +applications
                            .filter(app => app.company?.id === company?.id &&
                                app.recyclables.id === subCategoryId)
                            .map(app => app.totalWeight / 1000/*app.price*/)
                            .reduce((sum, a) => sum + a, 0).toFixed() / applications
                            .filter(app => app.company?.id === company?.id &&
                                app.recyclables.id === subCategoryId)
                            .map(app => app.totalWeight / 1000/*app.price*/).length,
                        //Возможно стоит добавить фильтрацию по типу купить/продать для заявки

                        value: applications
                            .filter(app => app.company?.id === company?.id &&
                                //@ts-ignore
                                app.recyclables.id === subCategoryId)
                            .map(app => app.totalWeight / 1000/*app.totalPrice ? app.totalPrice : app.price * app.volume*/)
                            .reduce((sum, a) => sum + a, 0).toFixed(1),
                    }))
                };
            }
        }

    }
    //получить 5 основных компаний по объёму рынка из функции currentTypeOfCompanies
    const findFiveBestCompanies = (companies: Array<{
        name: string,
        dealType: string,
        value: number,
        company_id: number,
        isFavorite: boolean,
        price: number,
    }>) => {
        const list = [];
        //выбираем пять компаний с наибольшим объёмом заявок
        const companies_values = companies
            .map(company => company.value)
            .sort((a, b) => b - a).slice(0, 5);
        // for (let i = 0; i < companies.length; i++) {
        //     for (let j = 0; j < companies_values.length; j++) {
        //         if (companies[i].value === companies_values[j]) {
        //             list.push(companies[i])
        //         }
        //     }
        // }

        return companies.filter(company => companies_values.includes(company.value));
    };
    //получение средней цены конкретной фракции и типа активности компании на основе цен пяти основных компаний
    const middlePriceByMainFive = (mainFiveCompanies: Array<{
        name: string,
        dealType: string,
        value: number,
        company_id: number,
        isFavorite: boolean,
        price: number,
    }>) => {
        return Math.round(mainFiveCompanies
                .map(company => company.price).reduce((sum, a) => sum + a, 0) /
            mainFiveCompanies.length
        );
    };

    //получение средней цены конкретной из всех объявлений
    const middlePriceByAllApplications = (currentTypeOfCompanies: Array<{
        name: string,
        dealType: string,
        value: number,
        company_id: number,
        isFavorite: boolean,
        price: number,
    }>) => {
        return Math.round(currentTypeOfCompanies.map(company => company.price).reduce((sum, a) => sum + a, 0) /
            currentTypeOfCompanies.length
        );
    };

    useEffect(() => {
    }, [applications, companyType, typeOFDeal, recyclables, recyclablesCategory, category, subCategory]);

    useGate(recyclableGate);
    useGate(categoryGate);
    useGate(forMainPageStatisticsGate)
    useGate(applicationsWithPeriodWithoutPagesGate);

    //__________________________________________________________
    const currentApps = applications
        .filter(app => app.recyclables?.id === subCategory?.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(app => [new Date(app.createdAt).toLocaleDateString().toString(), app?.price])


    let adaptiveLeft = '5%';
    const [, satisfies] = useScreenSize();
    if (!satisfies('xsm')) {
        adaptiveLeft = '10%';
    }

    const options = {
        tooltip: {},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {interval: 0, rotate: 45}
        },
        grid: {
            left: adaptiveLeft,
            right: '5%',
            bottom: '5%',
            top: '5%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'line',
                data: currentApps,
                itemStyle: {
                    color: '#399977'
                },
                areaStyle: {
                    color: 'rgba(57, 153, 119, 0.3)'
                }
            }
        ]
    };

    //__________________________________________________________
    return (
        <Container>
            <div className="mt-10 w-full">
                <NewLandingStats></NewLandingStats>
                <div className={'w-auto mt-6 inline-flex'}>
                    {/*<TabSelect
                        onChange={fields.application_recyclable_status_tab.onChange}
                        values={applicationRecyclableStatusSelectValues}
                        value={fields.application_recyclable_status_tab.value}
                    />*/}
                    <div className='w-96 mt-6'>
                        <Select
                            inputProps={{mode: "stroke"}}
                            placeholder={'Период'}
                            className="w-200"
                            onSelect={f.fields.period_tab.onChange}
                            data={TimeframeTypes}
                            value={f.fields.period_tab.value}
                        />
                    </div>
                </div>
                {(category.id > 0 || subCategory.id > 0) &&
                    <div className="mt-10">
                        <h3>{`Применённые фильтры:`}</h3>
                        <div className="inline-flex m-5">
                            {category.id > 0 &&
                                <div className="ml-5">
                                    <Button
                                        onClick={() => {
                                            setCategory({name: '', id: 0, value: 0});
                                            setSubCategory({name: '', id: 0, value: 0});
                                            setCompanyType('');
                                        }}
                                        mode='light'>{`Объём категории ${category.name} ${category.value} тонн`}</Button>
                                </div>
                            }
                            {subCategory.id > 0 &&
                                <div className="ml-5">
                                    <Button
                                        onClick={() => {
                                            setSubCategory({name: '', id: 0, value: 0});
                                            setCompanyType('');
                                        }}
                                        mode='light'>{`Объём фракции ${subCategory.name} ${subCategory.value} тонн`}</Button>
                                </div>
                            }
                            {companyType.length > 0 &&
                                <div className="ml-5">
                                    <Button
                                        onClick={() => setCompanyType('')}
                                        mode='light'>{`${companyType}`}</Button>
                                </div>
                            }
                        </div>
                    </div>
                }
                {companyType.length > 0 &&
                    <div className={s.chart_div}>
                        {currentApps.length > 0 &&
                            <div className="w-auto mt-5">
                                <ReactECharts option={options} className="w-full"/>
                            </div>
                        }
                        <h3 className="mt-5">
                            {`Основные ${companyType} по фракции ${subCategory.name}:`}
                        </h3>
                        {//@ts-ignore
                            findFiveBestCompanies(currentTypeOfCompanies(companies(applications, subCategory.id), companyType, subCategory.id).companiesData)
                                .map(company =>
                                    <CompaniesCardForStatistics company={company} key={company.company_id}/>)}
                        <div className="ml-[30vw]">
                            <p>{`Средняя цена на основе цен основных ${companyType === "Переработчик" || companyType === "Сборщик" ? companyType + "ов" : "Покупателей"}: ${
                                //@ts-ignore
                                middlePriceByMainFive(findFiveBestCompanies(currentTypeOfCompanies(companies(applications, subCategory.id), companyType, subCategory.id).companiesData))} ₽`}</p>
                            <p>
                                {`Средняя цена на основе всех ${companyType === "Переработчик" || companyType === "Сборщик" ? companyType + "ов" : "Покупателей"}: ${
                                    //@ts-ignore
                                    middlePriceByAllApplications(currentTypeOfCompanies(companies(applications, subCategory.id), companyType, subCategory.id).companiesData)} ₽`}
                            </p>
                        </div>
                    </div>
                }
                <div className="mt-14">
                    {(category.id > 0 && subCategory.id === 0) &&
                        <h3 className="mb-10">{`Статистика по категории ${category?.name}`}</h3>}
                    {(subCategory.id > 0 && companyType.length === 0) &&
                        <h3 className="mb-10">{`Статистика по фракции ${subCategory?.name}`}</h3>}
                    {(companyType.length > 0) &&
                        <h3 className="mb-10">{`Статистика по фракции ${subCategory?.name} для ${companyType}`}</h3>}
                </div>
                {category.id === 0 &&
                    <BarChart
                        width={1320}
                        height={350}
                        data={dataCategories(applications)}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            height={86}
                            tickFormatter={(name) => name.length > 10 ? `${name.slice(0, 10)}...` : name}
                            textAnchor="end"
                        />
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="value" name="объём тонн" fill="#399977"
                             onClick={e => setCategory({name: e.name, value: e.value, id: e.id})}/>

                    </BarChart>
                }

                {(subCategory?.id > 0 && companyType.length === 0) &&
                    <BarChart
                        width={1320}
                        height={350}
                        data={companies(applications, subCategory?.id)}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="value" name="Кол-во организаций" fill="#399977" onClick={e => {
                            //@ts-ignore
                            if (e.name === 'Переработчик' && !subCategory.name.toLowerCase().split(' ').includes('гранула')) {
                                setTypeOFDeal('покупка')
                            }
                            //@ts-ignore
                            if (e.name === 'Переработчик' && subCategory.name.toLowerCase().split(' ').includes('гранула')) {
                                setTypeOFDeal('продажа')
                            }
                            //@ts-ignore
                            if (e.name === 'Сборщик' && !subCategory.name.toLowerCase().split(' ').includes('гранула')) {
                                setTypeOFDeal('продажа')
                            }
                            //@ts-ignore
                            if (e.name === 'Покупатель' && subCategory.name.toLowerCase().split(' ').includes('гранула')) {
                                setTypeOFDeal('покупка')
                            }
                            //setCompanyAction(e.id);
                            setCompanyType(e.name);
                        }
                        }/>
                    </BarChart>
                }
                {(category.id > 0 && subCategory.id === 0) &&
                    <BarChart
                        width={1320}
                        height={350}
                        data={showFractionsHandler(category.id)}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            height={86}
                            tickFormatter={(name) => name.length > 10 ? `${name.slice(0, 10)}...` : name}
                            textAnchor="end"
                        />
                        <YAxis/>
                        <Tooltip/>
                        {/*<Legend />*/}
                        <Bar dataKey="value" name="объём тонн" fill="#399977"
                             onClick={e => setSubCategory({name: e.name, value: e.value, id: e.id})}/>

                    </BarChart>
                }

                {companyType.length > 0 &&
                        <BarChart
                            width={1320}
                            height={350}
                            data={
                                //@ts-ignore
                                currentTypeOfCompanies(companies(applications, subCategory?.id), companyType, subCategory.id).companiesData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                height={86}
                                tickFormatter={(name) => name.length > 10 ? `${name.slice(0, 10)}...` : name}
                                textAnchor="end"
                            />

                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="value" name="объём тонн" fill="#399977"/>
                        </BarChart>
                }
            </div>
        </Container>
    )
}