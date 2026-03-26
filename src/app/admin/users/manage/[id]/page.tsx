"use client";

import { useParams } from "next/navigation";
import GuardForReadOnlyUserInfo from "@/components/guards/views/page_guards/concrets/GuardForReadOnlyUserInfo";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import UserProfileForAppUser from "@/components/app_modules/users/views/control_panels/UserProfileForAppUser";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardForReadOnlyUserInfo>
      <ConsentForm moduleTarget="userinfo" id={id}>
        <PageStateProviderContainer>
          <UserProfileForAppUser userId={id} />
        </PageStateProviderContainer>
      </ConsentForm>
    </GuardForReadOnlyUserInfo>
  );
};

export default Page;
