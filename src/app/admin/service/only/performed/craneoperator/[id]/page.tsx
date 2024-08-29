import BaseRendererOfServicePerf from "@/components/app_modules/services_performed/view/single_views/BaseRendererOfServicePerf";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForReadOnlyUserInfo from "@/components/guards/views/page_guards/concrets/GuardForReadOnlyUserInfo";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForReadOnlyUserInfo>
            <ConsentForm moduleTarget="craneserviceonly" id={params.id}>
                <BaseRendererOfServicePerf id={params.id} type="tow" />
            </ConsentForm>
        </GuardForReadOnlyUserInfo>
    );
};

export default Page;
