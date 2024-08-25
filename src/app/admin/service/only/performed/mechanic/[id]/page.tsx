import BaseRendererOfServicePerf from "@/components/app_modules/services_performed/view/single_views/BaseRendererOfServicePerf";
import GuardForReadOnlyUserInfo from "@/components/guards/views/page_guards/concrets/GuardForReadOnlyUserInfo";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForReadOnlyUserInfo>
            <ConsentForm moduleTarget="mechanicserviceonly" id={params.id}>
                <BaseRendererOfServicePerf id={params.id} type="mechanical" />
            </ConsentForm>
        </GuardForReadOnlyUserInfo>
    );
};

export default Page;
