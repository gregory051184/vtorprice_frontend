import React from 'react';
import { NewDeal, newDealPageModel } from '@box/pages/deals/new';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';

const Index = () => (<NewDeal />);

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  scope,
  context,
}) => {
  await allSettled(
    newDealPageModel.getApplicationFx,
    { scope, params: context?.params?.application_id || 0 }
  );
});
export default Index;
