import { CompanyVerificationInfo } from '@box/pages/companies-verification/company';
import { allSettled } from 'effector';
import React from 'react';
import { withServerSideAuth } from '@box/providers';
import { companyVerificationModel } from '@box/entities/companyVerification';

function Index() {
  return (

    <CompanyVerificationInfo />

  );
}

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
  context,
  scope,
}) => {
  if (context?.params?.id) {
    await allSettled(
      companyVerificationModel.getCompanyVerificationFx,
      { scope, params: parseInt(context.params.id as string, 10) }
    );
  }
});

export default Index;
