"use client";

import { useRouteId } from "@/hooks/useRouteId";
import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
  const id = useRouteId();
  return (
    <GuardForServerUsers>
      <PageStateProviderContainer>
        <EnterprisePanelForUserServer id={id} />
      </PageStateProviderContainer>
    </GuardForServerUsers>
  );
};

export default Page;
