import React from 'react';
import { allSettled } from 'effector';
import { withServerSideAuth } from '@box/providers';
import { getCompanyFx, Company } from '@box/pages/companies';

function Index() {
  return <Company />;
}

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  scope,
  context,
}) => {
  await allSettled(getCompanyFx, { scope, params: context?.params?.id || 0 });
});

export default Index;
