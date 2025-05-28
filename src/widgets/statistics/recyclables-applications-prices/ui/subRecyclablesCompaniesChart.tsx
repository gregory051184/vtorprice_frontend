import {useGate, useStore, useUnit} from "effector-react";
import {applicationModel, applicationRecyclableStatusSelectValues} from '@box/entities/application';
import {gate as recyclableGate} from '@box/widgets/statistics/recyclables-applications-prices';
import React, {useEffect, useState} from "react";
import {Area, AreaChart, CartesianGrid, Pie, PieChart, Sector, Tooltip, XAxis, YAxis} from "recharts";
import {
    $recyclablesApplicationsPrices,
    IRecyclableApplicationPrice
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import {ICompany} from "@box/entities/company/model";

import {IRecyclableApplication} from "@box/entities/application/model";
import {$recyclablesCategory, gate as categoryGate} from "@box/entities/category/model";
import {companiesFavoritesListModel} from "@box/widgets/companies/companiesFavoritesList";
import {Button, Container, Table, TabSelect} from "@box/shared/ui";
import Verified from "@assets/icons/16_verified.svg";
import Reliable from "@assets/icons/16_reliable.svg";
import {useRouter} from "next/router";
import s from './style.module.scss';
import {useForm} from "@box/shared/effector-forms";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {forMainPageStatisticsGate} from "@box/widgets/applications/applicationsListForMainPage/model";


interface ISubCategoriesForChart {
    name: string,
    value: number,
    companies: Array<ICompany>,
    price: number,
}


const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                  fill="#333">{`${payload.name} ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

interface IUniversal {
    name: string,
    id: number,
    value: number
}

export const SubRecyclablesCompaniesChart: React.FC = () => {
    //НОВОЕ
    const router = useRouter();
    const recyclables = useStore($recyclablesApplicationsPrices);
    const recyclablesCategory = useStore($recyclablesCategory);
    const [subCategory, setSubCategory] = useState<IUniversal>({name: '', id: 0, value: 0});
    const [category, setCategory] = useState<IUniversal>({name: '', id: 0, value: 0});

    const [companyAction, setCompanyAction] = useState<IUniversal>({name: '', id: 0, value: 0});

    const updateInFavorite = useUnit(
        companiesFavoritesListModel.updateCompanyInFavoriteFx
    );
    const handleChangeisFavorite = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        id: number
    ) => {
        e.stopPropagation();
        updateInFavorite({id});
    };

    const showFractionsHandler = (categoryId?: number) => {
        if (categoryId && categoryId > 0) {
            return recyclables.filter(recyclable =>
                recyclable.category === categoryId
            ).map(cat => ({
                name: cat.name,
                value: applications
                    .filter(app =>
                        //@ts-ignore
                        app.recyclables.id === cat.id)
                    .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                    .reduce((sum, a) => sum + a, 0),
                id: cat.id

            }))
        } else {

            return recyclables.map(cat => ({
                name: cat.name,
                value: applications
                    .filter(app =>
                        //@ts-ignore
                        app.recyclables.id === cat.id)
                    .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                    .reduce((sum, a) => sum + a, 0),
                id: cat.id
            }))
        }
    }
    //для получения категорий для графиков
    const dataCategories = (applications: IRecyclableApplication[]) => {
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
                        category.value += applications[j].totalPrice ? applications[j].totalPrice : applications[j].price * applications[j].volume
                    }
                }
            }
            list.push(category);
        }
        return list;
    }
    //_______________________________________________

    const applications = useStore(applicationModel.$applications);

    const [companyType, setCompanyType] = useState<string>('');

    const [typeOFDeal, setTypeOFDeal] = useState<string>('');

    const {fields} = useForm(applicationFiltersForMainPageChart)

    //для составления списка компаний по типам активности
    const companies = (apps: applicationModel.IRecyclableApplication[], subCategoryId: number) => {

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
                list[2].price = apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.BUY && app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                    .reduce((sum, a) => sum + a, 0);
            }

            if (comp[j].dealType?.id === BuyOrSellDeals.SELL
                && comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[0].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[0].value += 1;
                list[0].companies.push(comp[j].company);
                list[0].price = apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.SELL && app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                    .reduce((sum, a) => sum + a, 0);
            }
            if (comp[j].dealType?.id === BuyOrSellDeals.SELL
                && !comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[1].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[1].value += 1;
                list[1].companies.push(comp[j].company);
                list[1].price = apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.SELL && !app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                    .reduce((sum, a) => sum + a, 0);
            }
            if (comp[j].dealType?.id === BuyOrSellDeals.BUY
                && !comp[j].recyclables.name.toLowerCase().split(' ').includes('гранула')
                && !list[0].companies.map(com => com.id).includes(comp[j].company.id)) {
                list[0].value += 1;
                list[0].companies.push(comp[j].company);
                list[0].price = apps.filter(app =>
                    app.dealType.id === BuyOrSellDeals.BUY && !app.recyclables.name.toLowerCase().split(' ').includes('гранула'))
                    .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                    .reduce((sum, a) => sum + a, 0);
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

                        price: applications
                            .filter(app => app.company?.id === company?.id &&
                                app.recyclables.id === subCategoryId)
                            .map(app => app.price)
                            .reduce((sum, a) => sum + a, 0) / applications
                            .filter(app => app.company?.id === company?.id &&
                                app.recyclables.id === subCategoryId)
                            .map(app => app.price).length,
                        //Возможно стоит добавить фильтрацию по типу купить/продать для заявки

                        value: applications
                            .filter(app => app.company?.id === company?.id &&
                                //@ts-ignore
                                app.recyclables.id === subCategoryId)
                            .map(app => app.totalPrice ? app.totalPrice : app.price * app.volume)
                            .reduce((sum, a) => sum + a, 0),
                    }))
                };
            }
        }

    };

    const changingOfPrices = (apps: applicationModel.IRecyclableApplication[]) => {
        return apps.map(app => ({price: app?.price, date: new Date(app?.createdAt).toLocaleDateString()}))
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
        for (let i = 0; i < companies.length; i++) {
            for (let j = 0; j < companies_values.length; j++) {
                if (companies[i].value === companies_values[j]) {
                    list.push(companies[i])
                }
            }
        }
        return list;
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

    //получение всех компаний данной фракции
    const all = (apps: applicationModel.IRecyclableApplication[], subCategoryId: number) => {
        const list = [];
        //@ts-ignore
        if (subCategory.id > 0) {
            const appsList = apps.filter(app => app.recyclables.id === subCategoryId);
            const companies = apps.map(app => app.company);
            for (let i = 0; i < companies.length; i++) {
                const comp = companies[i];
                const company_info = {
                    name: comp.name,
                    id: comp.id,
                    value: 0
                }
                for (let j = 0; j < appsList.length; j++) {
                    if (!list.map(elem => elem.id).includes(company_info.id)) {
                        if (appsList[j].company.id === comp.id) {
                            company_info.value += appsList[j].totalPrice ? appsList[j].totalPrice : appsList[j].price * appsList[j].volume
                        }
                    }
                }
                list.push(company_info)
            }
            return list;
        }
        if (category.id > 0) {
            const appsList = apps.filter(app => app.recyclables.category.id === subCategoryId);
            const companies = apps.map(app => app.company);
            for (let i = 0; i < companies.length; i++) {
                const comp = companies[i];
                const company_info = {
                    name: comp.name,
                    id: comp.id,
                    value: 0
                }
                for (let j = 0; j < appsList.length; j++) {
                    if (!list.map(elem => elem.id).includes(company_info.id)) {
                        if (appsList[j].company.id === comp.id) {
                            company_info.value += appsList[j].totalPrice ? appsList[j].totalPrice : appsList[j].price * appsList[j].volume
                        }
                    }
                }
                list.push(company_info)
            }
            return list;
        }
    };

    useEffect(() => {
    }, [applications, companyType, typeOFDeal, recyclables, recyclablesCategory, category, subCategory]);

    //useGate(gate);
    useGate(recyclableGate);
    useGate(categoryGate);

    useGate(forMainPageStatisticsGate)

    const [activeIndex, setActiveIndex] = useState<number>(0)

    const onPieEnter = (_: number, index: number) => {
        setActiveIndex(index);
    };

    return (
        <Container>
            <div className="mt-10 w-full">
                <div className={'w-auto mt-6'}>
                    <TabSelect
                        onChange={fields.application_recyclable_status_tab.onChange}
                        values={applicationRecyclableStatusSelectValues}
                        value={fields.application_recyclable_status_tab.value}
                    />
                </div>
                {(category.id > 0 || subCategory.id > 0) &&
                    <div>
                        <h2>{`Применённые фильтры:`}</h2>
                        <div className="inline-flex mt-5">
                            {category.id > 0 &&
                                <div className="ml-5">
                                    <Button
                                        onClick={() => {
                                            setCategory({name: '', id: 0, value: 0});
                                            setSubCategory({name: '', id: 0, value: 0});
                                            setCompanyType('');
                                        }}
                                        mode='light'>{`Объём категории ${category.name} ${category.value} руб.`}</Button>
                                </div>
                            }
                            {subCategory.id > 0 &&
                                <div className="ml-5">
                                    <Button
                                        onClick={() => {
                                            setSubCategory({name: '', id: 0, value: 0});
                                            setCompanyType('');
                                        }}
                                        mode='light'>{`Объём фракции ${subCategory.name} ${subCategory.value} руб.`}</Button>
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
                        <div>
                            <h3>{`График изменения цены на ${subCategory.name}`}</h3>
                            <AreaChart width={800} height={200} data={changingOfPrices(applications)}
                                       margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>

                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1}
                                      fill="url(#colorUv)"/>
                            </AreaChart>
                        </div>
                        <h3 className="mt-5">
                            {`Основные ${companyType} по фракции ${subCategory.name}:`}
                        </h3>
                        {//@ts-ignore
                            findFiveBestCompanies(currentTypeOfCompanies(companies(applications, subCategory.id), companyType, subCategory.id).companiesData)
                                .map(company =>
                                    <div className="cursor-pointer">
                                        <Table.Row
                                            onClick={() => {
                                                router.push(`/companies/${company.company_id}`);
                                            }}
                                        >
                                            <Table.Cell>
                                                <div className="flex items-center gap-6">
                                                    <p>
                                                        {company.name}
                                                        <>
                                                            <Verified className="inline"/>
                                                            <Reliable className="inline"/>
                                                        </>
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-6">
                                                    <p>
                                                        {`${company.value} ₽`}
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    onClick={(e) => handleChangeisFavorite(e, company.company_id)}
                                                    className="w-[130px]"
                                                    mode={company.isFavorite ? "stroke" : "fill"}
                                                    type="mini"
                                                >
                                                    {company.isFavorite ? 'Отписаться' : 'В избранное'}
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    </div>
                                )}
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
                        <h3>{`Статистика по категории ${category?.name}`}</h3>}
                    {(subCategory.id > 0 && companyType.length === 0) &&
                        <h3>{`Статистика по фракции ${subCategory?.name}`}</h3>}
                    {(companyType.length > 0) &&
                        <h3>{`Статистика по фракции ${subCategory?.name} для ${companyType}`}</h3>}
                </div>
                <PieChart width={1400} height={690}>
                    {companyType.length === 0 &&
                        <Pie dataKey="value"
                             data={category.id > 0 && subCategory.id === 0 ? all(applications, category.id) : all(applications, subCategory.id)}
                             cx={910} cy={180}
                             innerRadius={50}
                             activeShape={renderActiveShape}
                             activeIndex={activeIndex}
                             onMouseEnter={onPieEnter}
                             nameKey="name"
                             outerRadius={90} fill="#82ca9d"/>
                    }
                    {(category.id === 0 && subCategory.id === 0) &&
                        <Pie data={dataCategories(applications)} dataKey="value" nameKey="name" cx="45%" cy="52%"
                             style={{outline: 'none'}}
                             outerRadius={100} innerRadius={80}
                             activeShape={renderActiveShape}
                             activeIndex={activeIndex}
                             onMouseEnter={onPieEnter}
                             fill="#8884d8"
                             onClick={(e) => {
                                 setCategory({id: e.id, name: e.name, value: e.value});
                             }}
                        />
                    }

                    {subCategory?.id > 0 && companyType.length === 0 &&
                        <Pie data={companies(applications, subCategory?.id)} dataKey="value" nameKey="name" cx="45%"
                             cy="66%"
                             outerRadius={150}
                             innerRadius={130}
                             activeShape={renderActiveShape}
                             activeIndex={activeIndex}
                             onMouseEnter={onPieEnter}
                             fill="#8884d8" onClick={(e) => {
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
                            setCompanyType(e.name);

                        }}/>
                    }
                    {subCategory.id === 0 &&
                        <Pie data={category.id > 0 ? showFractionsHandler(category.id) : showFractionsHandler()}
                             dataKey="value"
                             nameKey="name" cx="45%" cy={category.id === 0 ? "52%" : "66%"}
                             style={{outline: 'none'}}
                             outerRadius={category.id === 0 ? 290 : 150} innerRadius={category.id === 0 ? 270 : 130}
                             activeShape={renderActiveShape}
                             activeIndex={activeIndex}
                             onMouseEnter={onPieEnter}
                             fill="#8884d8"
                             onClick={(e) => setSubCategory({id: e.id, name: e.name, value: e.value})}
                        />
                    }

                    {companyType.length > 0 &&
                        <Pie
                            activeShape={renderActiveShape}
                            activeIndex={activeIndex}
                            onMouseEnter={onPieEnter}
                            //@ts-ignore
                            data={companyType ? currentTypeOfCompanies(companies(applications, subCategory?.id), companyType, subCategory.id).companiesData : all(applications, subCategory.id)}
                            dataKey="value" cx="48%" cy="55%" innerRadius={210} outerRadius={230}
                            fill="#82ca9d"
                        />
                    }
                </PieChart>
                {/*companyType.length > 0 &&
                    //@ts-ignore
                    <MiddlePriceChart subCategory={subCategory.name} typeOfDeal={typeOFDeal}></MiddlePriceChart>
                */}
            </div>
        </Container>
    )
}