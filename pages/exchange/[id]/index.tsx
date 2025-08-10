import React from 'react';
import { StockGlass } from '@box/pages/exchange';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import { recyclableModel } from '@box/entities/recyclable';
import {ExchangeFractionPage} from "@box/pages/exchange/glass/exchangeFractionPage";


const Index = () => <ExchangeFractionPage/> //<StockGlass />;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  scope,
  context
}) => {
  if (context.params?.id) {
    // @ts-ignore
    await allSettled(recyclableModel.getRecyclableFx, {
      scope,
      params: context.params.id
    });
  }
});
export default Index;
