import GuardForReadOnlyUserInfo from "@/components/guards/views/page_guards/concrets/GuardForReadOnlyUserInfo";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import UserProfileForAppUser from "@/components/app_modules/users/views/control_panels/UserProfileForAppUser";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForReadOnlyUserInfo>
            <ConsentForm moduleTarget="userinfo" id={params.id}>
                <PageStateProviderContainer>
                    <UserProfileForAppUser userId={params.id} />
                </PageStateProviderContainer>
            </ConsentForm>
        </GuardForReadOnlyUserInfo>
    );
};

export default Page;
