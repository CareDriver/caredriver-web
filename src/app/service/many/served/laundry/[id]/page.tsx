import ClientIdPage from "@/components/guards/ClientIdPage";
import { TypeOfServicePerformed } from "@/components/app_modules/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/app_modules/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";
import PageLoading from "@/components/loaders/PageLoading";
import { Suspense } from "react";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <Suspense fallback={<PageLoading />}>
      <GuardForServices serviceType="laundry" fakeServerUserId={id}>
        <ConsentForm moduleTarget="userinfo" id={id}>
          <ListOfServicesPerfByUser
            userId={id}
            typeOfService="laundry"
            typeOfPerf={TypeOfServicePerformed.Served}
          />
        </ConsentForm>
      </GuardForServices>
    </Suspense>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
