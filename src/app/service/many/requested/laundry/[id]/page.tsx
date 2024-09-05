import { TypeOfServicePerformed } from "@/components/app_modules/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/app_modules/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForServices serviceType="laundry">
            <ConsentForm moduleTarget="userinfo" id={params.id}>
                <ListOfServicesPerfByUser
                    userId={params.id}
                    typeOfService="laundry"
                    typeOfPerf={TypeOfServicePerformed.Requested}
                />
            </ConsentForm>
        </GuardForServices>
    );
};

export default Page;
