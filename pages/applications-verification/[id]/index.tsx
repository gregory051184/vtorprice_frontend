import { withServerSideAuth } from '@box/providers';
import { allSettled } from 'effector';
import { ApplicationVerificationInfo } from '@box/pages/applications-verification';
import { applicationModel } from '@box/entities/application';

const Index = () => (
  <ApplicationVerificationInfo />
);

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
