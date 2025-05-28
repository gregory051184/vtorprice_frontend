import { SidebarLayout } from "@box/layouts";
import { Footer } from "@box/widgets/footer";
import { Header } from "@box/widgets/header";
import { AveragePrice } from "@box/widgets/profile-analytics/average-price/ui";
import { LogisticsDealsStats } from "@box/widgets/profile-analytics/logistics-deals/ui";
import { AppShell } from "@mantine/core";
import Head from "next/head";

export const Analitics = () => (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
        <Head>
            <title>Аналитика</title>
        </Head>
        <SidebarLayout>
            <AveragePrice/>
            <LogisticsDealsStats/>
        </SidebarLayout>
    </AppShell>
);