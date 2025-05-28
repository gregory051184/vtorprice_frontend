import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { ROLE } from "@types";

const useAuhRedirect = () => {
  const { user} = useStore($authStore);
  const { push, pathname} = useRouter();

  const ACCESS_TOKEN = Cookies.get('access_token');

  useEffect(() => {
    if (
      !pathname.includes('registration') &&
      !!ACCESS_TOKEN &&
      !user?.company &&
      (!user?.role || user.role.id === ROLE.COMPANY_ADMIN)
    ) {
      push('/registration')
    }
  }, [user, ACCESS_TOKEN])
};

export { useAuhRedirect };
