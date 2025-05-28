import App, { AppContext } from 'next/app';
import {
  allSettled, fork, serialize, Scope,
} from 'effector';
import { ssrAuthFx } from '@box/entities/auth';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getNdsFx } from '@box/entities/nds';

type Callback = ({
  context,
  scope,
}: {
  context: GetServerSidePropsContext,
  scope: Scope,
}) => Promise<void>;

interface IAuthorizeProps {
  access_token?: string,
  refresh_token?: string,
  scope: Scope
}

const authorize = async ({
  access_token,
  refresh_token,
  scope,
}: IAuthorizeProps) => {
  if (access_token) {
    await allSettled(ssrAuthFx, {
      scope,
      params: {
        access_token,
        refresh_token,
      },
    });

    await allSettled(getNdsFx, {
      scope,
    });
  }
};

interface IWithServerSideAuth {
  getInitialProps: (ctx:AppContext)=>void,
  getServerSideProps: (callback: Callback)=> GetServerSideProps
}

export const withServerSideAuth: IWithServerSideAuth = {
  getInitialProps: async (appCtx) => {
    const scope = fork();
    const appInitialProps = (await App.getInitialProps(appCtx)).pageProps;
    if (appCtx.ctx.req) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { access_token, refresh_token } = appCtx.ctx.req.cookies;
      await authorize({
        access_token,
        refresh_token,
        scope,
      });
    }

    return {
      pageProps: {
        ...appInitialProps,
        initialState: serialize(scope),
      },
    };
  },
  getServerSideProps: (callback) => async (ctx) => {
    const scope = fork();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, refresh_token } = ctx.req.cookies;

    await authorize({
      access_token,
      refresh_token,
      scope,
    });
    await callback({
      context: ctx,
      scope,
    });

    return {
      props: {
        initialState: serialize(scope),
      },
    };
  },
};
