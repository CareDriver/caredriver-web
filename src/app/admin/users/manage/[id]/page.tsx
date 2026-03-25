import ClientIdPage from "@/components/guards/ClientIdPage";
import GuardForReadOnlyUserInfo from "@/components/guards/views/page_guards/concrets/GuardForReadOnlyUserInfo";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import UserProfileForAppUser from "@/components/app_modules/users/views/control_panels/UserProfileForAppUser";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardForReadOnlyUserInfo>
      <ConsentForm moduleTarget="userinfo" id={id}>
        <PageStateProviderContainer>
          <UserProfileForAppUser userId={id} />
        </PageStateProviderContainer>
      </ConsentForm>
    </GuardForReadOnlyUserInfo>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
