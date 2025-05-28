import React from 'react';
import { UsersApplication } from '@box/pages/profile';
import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import { applicationModel } from '@box/entities/application';

const Index = () => <UsersApplication />;

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
