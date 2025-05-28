import React from 'react';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import { applicationModel } from '@box/entities/application';
import { UsersEquipmentApplication } from '@box/pages/profile/equipment-application';

const Index = () => <UsersEquipmentApplication />;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  context,
  scope,
}) => {
  if (context?.params?.id) {
    await allSettled(
      applicationModel.getEquipmentApplicationFx,
      { scope, params: parseInt(context.params.id as string, 10) }
    );
  }
});

export default Index;
