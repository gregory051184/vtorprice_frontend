import React from "react";
import { AppShell, SidebarLayout } from "@box/layouts";
import { Header } from "@box/widgets/header";
import { Footer } from "@box/widgets/footer";
import FinancialDealsChart from "@box/widgets/statistics/financial-deals/ui";
import { FinancialDataFilters } from "@box/features/statistics";
import { FinancialDealsList } from "@box/widgets/statistics/financialDealList";
import classNames from "classnames";

import s from "./style.module.scss";

export const FinancialData = () => (
  <AppShell header={<Header />} footer={<Footer />}>
    <SidebarLayout>
      <p className="text-center">Количество проведенных сделок</p>
      <FinancialDataFilters className="mb-9" />
      <FinancialDealsChart />
      <p className={classNames("text-lg font-semibold", s.subtitle)}>
        Платежные поручениия
      </p>
      <FinancialDealsList />
    </SidebarLayout>
  </AppShell>
);
