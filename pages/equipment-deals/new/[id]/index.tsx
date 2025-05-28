import React from 'react';
import { EquipmentDeal, newEquipmentDealPageModel } from '@box/pages/equipment-deals/new';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';

const Index = () => (<EquipmentDeal />);

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
 scope,
 context,
}) => {
  await allSettled(
    newEquipmentDealPageModel.getEquipmentApplicationFx,
    { scope, params: context?.params?.id || 0 }
  );
});

export default Index;
