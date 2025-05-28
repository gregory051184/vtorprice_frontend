import React from 'react';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import { applicationModel } from '@box/entities/application';
import { ApplicationManagement } from '@box/pages/profile/applications-managment/item';

const Index = () => <ApplicationManagement />;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  context,
  scope,
}) => {
  if (context?.params?.id) {
    await allSettled(
      applicationModel.getApplicationFx,
      { scope, params: parseInt(context.params.id as string, 10) }
    );
  }
});

export default Index;