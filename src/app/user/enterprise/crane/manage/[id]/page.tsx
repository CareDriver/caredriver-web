"use client";

import { useParams } from "next/navigation";
import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardForServerUsers>
      <PageStateProviderContainer>
        <EnterprisePanelForUserServer id={id} />
      </PageStateProviderContainer>
    </GuardForServerUsers>
  );
};

export default Page;
