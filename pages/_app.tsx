import '../src/app/styles/globals.scss';
import type {AppProps} from 'next/app';
import {NextPage} from 'next';
import React, {ReactElement, ReactNode} from 'react';
import {AuthModal} from '@box/widgets/authModal';
import {Scope, fork, serialize} from 'effector';
import {Provider} from 'effector-react/scope';

import {withServerSideAuth} from '@box/providers';
import Head from 'next/head';
import {useInit} from '@box/shared/hooks/useInit';
import {AlertDialog, ConfirmDialog} from '@box/entities/notification';
import {NotVerificatedAlert} from '@box/entities/notVerificatedAlert/ui';
import {NotAuthAlert} from '@box/entities/notAuthAlert/ui';
import {SubscribeAppsCountModal, SubscribeModal} from "@box/widgets/subscribeModal";

let clientScope: Scope;

export type NextPageWithAdditionalKeys = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
    protected?: Array<any>;
};

type AppPropsWithAdditionalKeys = AppProps & {
    Component: NextPageWithAdditionalKeys;
};

function VtorPrice({Component, pageProps}: AppPropsWithAdditionalKeys) {
    const getLayout = Component.getLayout ?? ((page) => page);
    const scope = fork({
        values: {
            ...(clientScope && serialize(clientScope)),
            ...pageProps.initialState,
        },
    });

    if (typeof window !== 'undefined') {
        clientScope = scope;
    }
    useInit();

    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.png"/>
                <link rel="manifest" href="/manifest.json"/>
            </Head>
            <Provider value={scope}>
                {getLayout(<Component {...pageProps} />)}
                <div id="modals"/>
                <AuthModal/>
                <SubscribeModal/>
                <SubscribeAppsCountModal/>
                <ConfirmDialog/>
                <AlertDialog/>
                <NotAuthAlert withModelStateToShow={true}/>
                <NotVerificatedAlert withModelStateToShow={true}/>
            </Provider>
        </>
    );
}

VtorPrice.getInitialProps = withServerSideAuth.getInitialProps;

export default VtorPrice;
