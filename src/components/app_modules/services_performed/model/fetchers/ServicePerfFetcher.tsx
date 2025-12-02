import { getDocs, query, where } from "firebase/firestore";
import { getCollectionOfServicesPerf } from "../utils/CollectionGetter";
import { ServiceType } from "@/interfaces/Services";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";

export async function findServicePerfByFakeId(
  fakedId: string,
  type: ServiceType,
): Promise<ServiceRequestInterface | undefined> {
  let collectionRef = getCollectionOfServicesPerf(type);
  let dataQuery = query(collectionRef, where("fakedId", "==", fakedId));

  let documents = await getDocs(dataQuery);
  if (documents.empty) {
    return undefined;
  }

  let serviceFound = documents.docs[0].data() as ServiceRequestInterface;
  return serviceFound;
}

export async function verifyExistenceFfTheServicePerfByFakeId(
  fakedId: string,
  type: ServiceType,
): Promise<boolean> {
  return findServicePerfByFakeId(fakedId, type) !== undefined;
}
