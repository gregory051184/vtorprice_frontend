import React from "react";

import { AppShell, SidebarLayout } from "@box/layouts";
import { Header } from "@box/widgets/header";
import { Footer } from "@box/widgets/footer";
import { PaymentInvoicesList } from "@box/widgets/payment-invoice";
import Head from "next/head";

export const PaymentInvoices = () => (
  <AppShell header={<Header />} footer={<Footer />}>
    <Head>
      <title>Счета на оплату</title>
    </Head>
    <SidebarLayout>
      <PaymentInvoicesList />
    </SidebarLayout>
  </AppShell>
);
