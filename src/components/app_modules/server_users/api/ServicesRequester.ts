import { UserRequest } from "@/interfaces/UserRequest";
import {
  CollectionReference,
  doc,
  DocumentSnapshot,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { driveReqCollection } from "./DriveRequester";
import { deleteFile } from "../../../../utils/requesters/FileUploader";
import { toast } from "react-toastify";
import { UserInterface } from "@/interfaces/UserInterface";
import { saveBalanceHistoryItem } from "../../users/api/BalanceHistoryRequester";
import { nanoid } from "nanoid";
import { mechanicReqCollection } from "./MechanicRequester";
import { towReqCollection } from "./TowRequester";
import { laundryReqCollection } from "./LaundryRequester";
import { ServiceType } from "@/interfaces/Services";
import {
  getDocInRealTime,
  RealTimeResponse,
} from "@/utils/requesters/RealTimeFetcher";

export const MIN_NUM_OF_APPROVALS = 1;

export const getPaginatedData = async (
  direction: "next" | "prev" | undefined,
  collection: CollectionReference,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 10,
) => {
  let dataQuery = query(
    collection,
    orderBy("active"),
    limit(numPerPage),
    where("aproved", "==", false),
    where("active", "==", true),
  );

  if (direction === "next" && startAfterDoc) {
    dataQuery = query(dataQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    dataQuery = query(
      collection,
      orderBy("active"),
      endBefore(endBeforeDoc),
      limitToLast(numPerPage),
      where("aproved", "==", false),
      where("active", "==", true),
    );
  }

  const reqsSnapshot = await getDocs(dataQuery);
  const reqs = reqsSnapshot.docs.map((doc) => {
    var userReq = doc.data() as UserRequest;
    userReq.id = doc.id;
    return userReq;
  });

  return {
    result: reqs,
    lastDoc: reqsSnapshot.docs[reqsSnapshot.docs.length - 1],
    firstDoc: reqsSnapshot.docs[0],
  };
};

export const getNumPages = async (
  numPerPages: number,
  collection: CollectionReference,
): Promise<number> => {
  const count = await getCountFromServer(
    query(
      collection,
      where("aproved", "==", false),
      where("active", "==", true),
    ),
  );
  const numPages = Math.ceil(count.data().count / numPerPages);
  return numPages;
};

export const getAllHistoryData = async (
  collection: CollectionReference,
): Promise<UserRequest[]> => {
  const dataQuery = query(collection, where("active", "==", false));
  const reqsSnapshot = await getDocs(dataQuery);
  const reqs = reqsSnapshot.docs.map((docSnap) => {
    var userReq = docSnap.data() as UserRequest;
    userReq.id = docSnap.id;
    return userReq;
  });

  reqs.sort((a, b) => {
    const aDate = a.reviewedByHistory?.[0]?.dateTime;
    const bDate = b.reviewedByHistory?.[0]?.dateTime;
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return bDate.toMillis() - aDate.toMillis();
  });

  return reqs;
};

export const getReqToBeUserServerById = async (
  id: string,
  collection: CollectionReference,
): Promise<UserRequest | undefined> => {
  try {
    const reqDoc = await getDoc(doc(collection, id));
    if (reqDoc.exists()) {
      var data = reqDoc.data() as UserRequest;
      data.id = id;
      return data;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};

export const getReqToBeUserServerInRealTime = async (
  id: string,
  collection: CollectionReference,
  behavior: RealTimeResponse<UserRequest>,
): Promise<Unsubscribe> => {
  const q = query(collection, where("id", "==", id));
  return await getDocInRealTime<UserRequest>(q, behavior);
};

export const numOfApprovals = (req: UserRequest): number => {
  var approvals = 0;
  req.reviewedByHistory?.forEach((history) => {
    if (history.aproved) {
      approvals++;
    }
  });

  return approvals;
};

export const getServiceCollection = (type: ServiceType) => {
  switch (type) {
    case "driver":
      return driveReqCollection;
    case "mechanical":
      return mechanicReqCollection;
    case "tow":
      return towReqCollection;
    default:
      return laundryReqCollection;
  }
};

export const deleteImages = async (serviceReq: UserRequest) => {
  try {
    /* if (typeof serviceReq.newProfilePhotoImgUrl !== "string") {
            await deleteFile(serviceReq.newProfilePhotoImgUrl.ref);
        } */
    await deleteFile(serviceReq.realTimePhotoImgUrl.ref);
    // Remove vehicle licenses
    /*         if (serviceReq.vehicles) {
            serviceReq.vehicles.forEach(async (vehicle) => {
                if (vehicle.license.frontImgUrl) {
                    await deleteFile(vehicle.license.frontImgUrl?.ref);
                }
                if (vehicle.license.backImgUrl) {
                    await deleteFile(vehicle.license.backImgUrl?.ref);
                }
            });
        } */
  } catch (e) {
    console.log(e);
  }
};

export const deleteImagesIfLimitOfApproves = async (
  serviceReq: UserRequest,
) => {
  if (
    serviceReq.reviewedByHistory &&
    serviceReq.reviewedByHistory?.length + 1 === MIN_NUM_OF_APPROVALS
  ) {
    /* try {
            await toast.promise(deleteImages(serviceReq), {
                pending: "Eliminando imágenes, por favor espera",
                success: "Images eliminadas",
                error: "Error al eliminar imágenes, inténtalo de nuevo por favor",
            });
        } catch (e) {
            console.log(e);
        } */
  }
};

export const updateService = async (
  id: string,
  newData: Partial<UserRequest>,
  collection: CollectionReference,
): Promise<void> => {
  try {
    const userRef = doc(collection, id);
    await updateDoc(userRef, newData);
  } catch (error) {
    throw error;
  }
};

export const setFirstService = async (
  user: UserInterface,
  current: Partial<UserInterface>,
  adminId: string,
): Promise<Partial<UserInterface>> => {
  // TODO: DAR EL BALANCE INICIAL CON TIEMPO DE EXPIRACIÓN
  // const balanceGift = 5;
  // if (user.services.length === 1) {
  //   current = {
  //     ...current,
  //     balance: {
  //       currency: "Bs. (BOB)",
  //       amount: user.balance.amount + balanceGift,
  //     },
  //   };
  //   await toast.promise(saveBalanceGift(user, adminId), {
  //     pending: `Regalando ${balanceGift} Bs. de saldo por ser nuevo proveedor de servicios`,
  //     success: `${balanceGift} Bs. de saldo regalado`,
  //     error: "Error al regalar saldo, inténtalo de nuevo por favor",
  //   });
  // }
  // if (!user.serverUserAt) {
  //   current = {
  //     ...current,
  //     serverUserAt: Timestamp.now(),
  //   };
  // }

  return current;
};

export const saveBalanceGift = async (user: UserInterface, adminId: string) => {
  try {
    const balanceHistoryId = nanoid();
    await saveBalanceHistoryItem(balanceHistoryId, {
      id: balanceHistoryId,
      dateTime: Timestamp.now(),
      oldBalance: user.balance,
      previousBalance: {
        amount: user.balance.amount + 5,
        currency: "Bs. (BOB)",
      },
      userWhoChanged: adminId,
      modificationReason: "Regalo por ser nuevo proveedor de servicios",
    });
  } catch (e) {
    console.log(e);
  }
};

export const saveReview = async (
  serviceReq: UserRequest,
  reviewerId: string,
  wasApproved: boolean,
  collection: CollectionReference,
) => {
  const isLimitToReviews: boolean =
    serviceReq.reviewedByHistory !== undefined &&
    serviceReq.reviewedByHistory.length + 1 === MIN_NUM_OF_APPROVALS;
  const serviceReview = {
    adminId: reviewerId,
    dateTime: Timestamp.now(),
    aproved: wasApproved,
  };
  var newReviewServiceHistory = serviceReq.reviewedByHistory
    ? [...serviceReq.reviewedByHistory, serviceReview]
    : [serviceReview];
  var toUpdateReq: Partial<UserRequest> = {
    reviewedByHistory: newReviewServiceHistory,
    active: isLimitToReviews ? false : true,
    aproved: isLimitToReviews ? wasApproved : serviceReq.aproved,
  };
  if (isLimitToReviews && serviceReq.vehicles) {
    const imgDeleted = {
      ref: "deleted",
      url: "",
    };

    // Delete vehicle licenses images
    /* var vehiclesWithoutImages = serviceReq.vehicles.map((vehicle) => {
                        return {
                            ...vehicle,
                            license: {
                                ...vehicle.license,
                                backImgUrl: imgDeleted,
                                frontImgUrl: imgDeleted,
                            },
                        };
                    }); */

    toUpdateReq = {
      ...toUpdateReq,
      realTimePhotoImgUrl: imgDeleted,
    };

    /*         if (typeof serviceReq.newProfilePhotoImgUrl !== "string") {
            toUpdateReq = {
                ...toUpdateReq,
                newProfilePhotoImgUrl: imgDeleted,
            };
        } */
  }

  await updateService(serviceReq.id, toUpdateReq, collection);
};
