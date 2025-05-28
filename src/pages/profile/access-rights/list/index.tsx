import React from "react";

import { AppShell, SidebarLayout } from "@box/layouts";
import { Header } from "@box/widgets/header";
import { Footer } from "@box/widgets/footer";
import RoleCards from "@box/widgets/users/roleCards/ui";
import { UsersRoleList } from "@box/widgets/users";

export const AccessRights = () => (
  <AppShell header={<Header />} footer={<Footer />}>
    <SidebarLayout>
      <RoleCards />
      <UsersRoleList className="mt-6"/>
    </SidebarLayout>
  </AppShell>
);
