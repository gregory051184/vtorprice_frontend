import React, {useEffect, useMemo, useState} from 'react';
import {AppShell} from '@box/layouts';
import {Header} from '@box/widgets/header';
import ReactECharts from 'echarts-for-react';
import {Footer} from '@box/widgets/footer';
import {BackButton, Container, TabSelect, Button, Drawer} from '@box/shared/ui';
import {useEvent, useStore} from 'effector-react';
import {recyclableModel} from '@box/entities/recyclable';
import {
    purchase,
    sales,
    StockGlassPurchaseList,
    StockGlassSalesList
} from '@box/widgets/applications';
import Head from 'next/head';
import {StockGlassFilters} from '@box/features/application';
import {useRouter} from 'next/router';
import {getGraphOptions} from './config';
import {
    $graphData, $period, getGraphDataFx, selectValues, setPeriod
} from './model';
import classNames from "classnames";
import s from './style.module.scss';
import {useBoolean} from "@box/shared/hooks";
import InfoIcon from '@assets/icons/16_info.svg';
import {BreadCrumbs} from "@box/shared/ui/breadCrumbs";
import {NoGraphData} from '@box/shared/ui/noGraphData';

export const StockGlass = () => {
    const recyclable = useStore(recyclableModel.$recyclable);
    const router = useRouter();
    const urgencyType = router.query.type;
    const {id} = router.query;
    const period = useStore($period);
    const periodChange = useEvent(setPeriod);
    const fetchGraphData = useEvent(getGraphDataFx);
    const graphData = useStore($graphData);
    const purchasesStore = useStore(purchase.store);
    const salesStore = useStore(sales.store);
    const validGraphConfig = useMemo(() => getGraphOptions(graphData), [graphData]);
    const [active, setActive] = useState(1);
    const {value, toggle} = useBoolean(false);

    let hasGraphData = true;
    if (graphData === undefined || graphData.length === 0) {
        hasGraphData = false;
    }

    useEffect(() => {
        fetchGraphData({
            // @ts-ignore
            id: id as number,
            period: period.value
        });
    }, [period]);
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>{recyclable?.name}</title>
            </Head>
            <Container>
                <Drawer title={recyclable?.name} visible={value} close={toggle}>
                    <>
            <span className='text-grey-30 text-[14px]'>
              Описание
            </span>
                        <div className='mt-[10px] text-[14px]'>{recyclable?.description}</div>
                    </>
                </Drawer>
                <BackButton/>
                {recyclable && (
                    <>
                        <div className='flex items-center gap-[20px] mt-[9px]'>
                            <h1 className="text-2xl font-medium">{recyclable.name}</h1>
                            {!!recyclable.description &&
                                <Button className={s.description} onClick={toggle}
                                        iconLeft={<InfoIcon/>}>Описание</Button>}
                        </div>
                        <BreadCrumbs
                            className="mt-[10px]"
                            breadcrumbs={[
                                {
                                    text: "Биржа",
                                    href: "/exchange",
                                },
                                {
                                    text: recyclable.name
                                },
                            ]}
                        />

                        <div className={s.top}>
                            <TabSelect
                                className="my-[20px]"
                                onChange={periodChange}
                                values={selectValues}
                                value={period}

                            />
                            {hasGraphData && <p className='mx-auto text-center text-grey-40'>График изменения цены</p>}
                        </div>
                        {hasGraphData && <ReactECharts option={validGraphConfig}/>}
                        {!hasGraphData && <NoGraphData text={"Нет данных"}/>}
                    </>
                )}
                <StockGlassFilters urgencyType={urgencyType as any} className="mt-[40px]"/>
                <div className={classNames("justify-between items-center", s.tabs)}>
                    <div
                        className={classNames(active === 1 ? s.tab_active : '', s.tab)}
                        onClick={() => active === 2 && setActive(1)}
                    >
                        Покупка ({purchasesStore.count})
                    </div>
                    <div
                        className={classNames(active === 2 ? s.tab_active : '', s.tab)}
                        onClick={() => active === 1 && setActive(2)}
                    >
                        Продажа ({salesStore.count})
                    </div>
                </div>
                <StockGlassSalesList className="mt-[40px]" show={active === 2}/>
                <StockGlassPurchaseList className="mt-[20px]" show={active === 1}/>
            </Container>
        </AppShell>
    );
};
