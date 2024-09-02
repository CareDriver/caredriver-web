import ReviewFormToChangeFromEnterpriseToUser from "@/components/app_modules/server_users/views/review_forms/to_change_enterprise/ReviewFormToChangeFromEnterpriseToUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardOfRequests>
            <ConsentForm moduleTarget="changeenterprisereq" id={params.id}>
                <ReviewFormToChangeFromEnterpriseToUser reqId={params.id} />
            </ConsentForm>
        </GuardOfRequests>
    );
};

export default Page;
