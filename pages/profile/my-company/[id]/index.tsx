import React from 'react';
import { allSettled } from 'effector';
import { withServerSideAuth } from '@box/providers';
import { getCompanyFx } from '@box/pages/companies';
import { ACompanyManagement } from '@box/pages/profile/my-company/item';

function Index() {
  return <ACompanyManagement />;
}

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  scope,
  context,
}) => {
  await allSettled(getCompanyFx, { scope, params: context?.params?.id || 0 });
});

export default Index;