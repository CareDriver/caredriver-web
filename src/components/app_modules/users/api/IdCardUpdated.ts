import { emptyIdCard, IdentityCard, UserInterface } from "@/interfaces/UserInterface";
import { deleteFile, uploadFileBase64 } from "../../../../utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { EMPTY_REF_ATTACHMENT, RefAttachment } from "@/components/form/models/RefAttachment";
import { updateUser } from "./UserRequester";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { isImageBase64 } from "../../../../validators/ImageValidator";
import { IdCard } from "@/components/app_modules/server_users/models/PersonalDataFields";

const updatePhoto = async (image: string, oldImageRef: string): Promise<RefAttachment> => {
    if (oldImageRef !== "") {
        await deleteFile(oldImageRef);
    }
    return await uploadFileBase64(DirectoryPath.IdCards, image);
};

export const uploadNewCard = async (idCard: IdCard, userId: string) => {
    try {
        var backCardRef = EMPTY_REF_ATTACHMENT;
        var frontCardRef = EMPTY_REF_ATTACHMENT;
        if (idCard.backCard.value) {
            backCardRef = await uploadFileBase64(
                DirectoryPath.IdCards,
                idCard.backCard.value,
            );
        }
        if (idCard.frontCard.value) {
            frontCardRef = await uploadFileBase64(
                DirectoryPath.IdCards,
                idCard.frontCard.value,
            );
        }
        await updateUser(userId, {
            identityCard: {
                frontCard: frontCardRef,
                backCard: backCardRef,
                location: idCard.location.value,
                updatedDate: Timestamp.now(),
            },
        });
    } catch (e) {}
};

export const updateIdCard = async (idCard: IdCard, user: UserInterface) => {
    var toUpdate: IdentityCard = user.identityCard ? user.identityCard : emptyIdCard;
    var wasUpdated: boolean = false;

    if (!user.identityCard && user.id) {
        await toast.promise(uploadNewCard(idCard, user.id), {
            pending: "Guardando carnet de identidad",
            success: "Carnet de identidad guardado",
            error: "Error al guardar tu carnet de identidad, inténtalo de nuevo por favor",
        });
    } else if (user.identityCard) {
        if (idCard.frontCard.value && isImageBase64(idCard.frontCard.value)) {
            const frontCardRef = await toast.promise(
                updatePhoto(idCard.frontCard.value, user.identityCard.frontCard.ref),
                {
                    pending: "Cambiando foto por delante de tu carnet de identidad",
                    success: "Foto por delante de tu carnet cambiado",
                    error: "Error al cambiar la foto por delante de tu carnet",
                },
            );
            toUpdate = {
                ...toUpdate,
                frontCard: frontCardRef,
            };
            wasUpdated = true;
        }

        if (idCard.backCard.value && isImageBase64(idCard.backCard.value)) {
            const backCardRef = await toast.promise(
                updatePhoto(idCard.backCard.value, user.identityCard.backCard.ref),
                {
                    pending: "Cambiando foto por detras de tu carnet de identidad",
                    success: "Foto por detras de tu carnet cambiado",
                    error: "Error al cambiar la foto por detras de tu carnet",
                },
            );
            toUpdate = {
                ...toUpdate,
                backCard: backCardRef,
            };
            wasUpdated = true;
        }

        if (idCard.location.value !== user.identityCard.location) {
            toUpdate = {
                ...toUpdate,
                location: idCard.location.value,
            };

            wasUpdated = true;
        }

        if (wasUpdated) {
            toUpdate = {
                ...toUpdate,
                updatedDate: Timestamp.fromDate(new Date()),
            };
        }

        if (wasUpdated && user.id) {
            await toast.promise(
                updateUser(user.id, {
                    identityCard: toUpdate,
                }),
                {
                    pending: "Guardando los cambios de tu carnet en tu perfil",
                    success: "Datos de tu carnet cambiados",
                    error: "Error al cambiar los datos de tu carnet",
                },
            );
        }
    }
};
