"use client";

import { useParams } from "next/navigation";
import EnterprisePanelForAdmin from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForAdmin";
import GuardOfEnterprises from "@/components/guards/views/page_guards/concrets/GuardOfEnterprises";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfEnterprises>
      <PageStateProviderContainer>
        <EnterprisePanelForAdmin id={id} />;
      </PageStateProviderContainer>
    </GuardOfEnterprises>
  );
};

export default Page;
