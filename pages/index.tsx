import { Home } from '@box/pages/home';
import { withServerSideAuth } from "@box/providers";
import { allSettled } from "effector";
import { getMeSsrFx } from "@box/entities/auth";

export default function Index(): JSX.Element {
  return <Home />;
}

export const getServerSideProps = withServerSideAuth.getServerSideProps(async ({
 scope,
 context
}) => {
  const accessToken = context.req.cookies.access_token;

  if (accessToken) {
    await allSettled(getMeSsrFx, {
      scope,
      params: accessToken
    });
  }
});
