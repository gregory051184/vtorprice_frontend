import {BackButton, Button, Container} from "@box/shared/ui";
import {Footer} from "@box/widgets/footer";
import {Header} from "@box/widgets/header";
import {AppShell} from "@box/layouts";
import Head from "next/head";
import {RecycablePrices} from "@box/widgets/statistics/recyclables-prices";
import {EmployeesQuantity} from "@box/widgets/statistics/employees-quantity";
import {DealsStats} from "@box/widgets/statistics/deals-stats/ui";
import {ApplicationsStats} from "@box/widgets/statistics/applications-stats/ui";
import {RecyclablesVolumeStats} from "@box/widgets/statistics/recyclables-volume-stats/ui";
import {CompaniesStats} from "@box/widgets/statistics/companies-stats/ui";
import {RecyclableApplicationPrices} from "@box/widgets/statistics/recyclables-applications-prices";
import {
    SubRecyclablesCompaniesChart
} from "@box/widgets/statistics/recyclables-applications-prices/ui/subRecyclablesCompaniesChart";
import {useState} from "react";
import {
    MainRecyclableBarChart
} from "@box/widgets/statistics/recyclables-applications-prices/ui/mainRecyclableBarChart";



export const Statistics = () => {
    const [transformToBar, setTransformToBar] = useState<boolean>(true);
    const [showOtherStatistics, setShowOtherStatistics] = useState<boolean>(false);

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Head>
                <title>Статистика</title>
            </Head>
            <Container className="pt-[0px]">
                <div>
                    <BackButton className='mb-[10px] text-sm'/>
                    <div className="flex items-center gap-6">
                        <h1 className="font-normal text-2xl">Статистика</h1>
                        <div className="ml-[25vw]">
                            <Button mode='light'
                                    onClick={() => setTransformToBar(!transformToBar)}>
                                {!transformToBar ? 'Поменять отображение статистики на столбцовые диаграммы' :
                                    'Поменять отображение статистики на радиальные диаграммы'}</Button>
                        </div>
                    </div>
                </div>

                {!transformToBar ?
                    <SubRecyclablesCompaniesChart></SubRecyclablesCompaniesChart> :
                    <MainRecyclableBarChart></MainRecyclableBarChart>
                }
                <RecyclableApplicationPrices/>
                <div className="mt-32">
                    <Button mode='light'
                            fullWidth={true}
                            onClick={() => setShowOtherStatistics(!showOtherStatistics)}>
                        {!showOtherStatistics ? 'Открыть дополнительную статистику' :
                            'Скрыть дополнительную статистику'}</Button>
                </div>
                {showOtherStatistics &&
                    <div>
                        {/*<RecyclableApplicationPrices/>*/}
                        <RecyclablesVolumeStats/>
                        <RecycablePrices/>
                        <ApplicationsStats/>
                        <CompaniesStats/>
                        <DealsStats/>
                        <EmployeesQuantity/>
                    </div>
                }
            </Container>
        </AppShell>
    )
};
