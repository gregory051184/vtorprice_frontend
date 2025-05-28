import React from 'react';
import {ApplicationPage} from '@box/pages/applications';
import {withServerSideAuth} from '@box/providers';
import {allSettled} from 'effector';
import {applicationModel} from '@box/entities/application';

const Index = () => <ApplicationPage/>;

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
                                                                                   scope,
                                                                                   context,
                                                                               }) => {
    await allSettled(applicationModel.getApplicationFx, {scope, params: context?.params?.id || 0});
});

export default Index;
