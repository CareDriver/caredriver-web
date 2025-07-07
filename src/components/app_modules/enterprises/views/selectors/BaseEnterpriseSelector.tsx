"use client";
import { Enterprise } from "@/interfaces/Enterprise";
import {
  getAllNumPages,
  getAllPaginatedData,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { DocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import "@/styles/components/enterprise.css";
import Plus from "@/icons/Plus";
import { AuthContext } from "@/context/AuthContext";
import { Locations } from "@/interfaces/Locations";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceType } from "@/interfaces/Services";
import {
  cutTextWithDotsByLength,
  MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";
import Image from "next/image";

interface Props {
  typeOfEnterprise: ServiceType;
  behavior: {
    pageSize?: number;
    localSelecction?: boolean;
    selectEnterprise: (enterprise: Enterprise | undefined) => void;
  };
}

const BaseEnterpriseSelector: React.FC<Props> = ({
  typeOfEnterprise,
  behavior,
}) => {
  const PAGE_SIZE = behavior.pageSize ?? 6;
  const { checkingUserAuth, user } = useContext(AuthContext);
  const [selectedEnterprise, setSelectedEnterprise] = useState<
    undefined | Enterprise
  >(undefined);
  const [data, setData] = useState<Enterprise[] | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined,
  );
  const [pages, setPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const selectEnterprise = (enterprise: Enterprise) => {
    if (
      behavior.localSelecction === undefined ||
      behavior.localSelecction === true
    ) {
      if (selectedEnterprise?.id === enterprise.id) {
        setSelectedEnterprise(undefined);
        behavior.selectEnterprise(undefined);
      } else {
        setSelectedEnterprise(enterprise);
        behavior.selectEnterprise(enterprise);
      }
    } else {
      behavior.selectEnterprise(enterprise);
    }
  };

  const getLocation = (user: UserInterface | null) => {
    return user && user.location ? user.location : Locations.CochabambaBolivia;
  };

  useEffect(() => {
    if (!checkingUserAuth && user) {
      let location = getLocation(user);
      getAllNumPages(location, PAGE_SIZE, typeOfEnterprise)
        .then((pages) => setPages(pages))
        .catch((e) => {
          console.log(e);
        });
    }
  }, [checkingUserAuth, PAGE_SIZE, typeOfEnterprise, user]);

  useEffect(() => {
    if (!checkingUserAuth && user) {
      const startAfterDoc = lastDoc;
      const endBeforeDoc = undefined;
      setLoading(true);
      let location = getLocation(user);
      getAllPaginatedData(
        location,
        typeOfEnterprise,
        "next",
        startAfterDoc,
        endBeforeDoc,
        PAGE_SIZE,
      )
        .then((result) => {
          if (data) {
            setData([...data, ...result.result]);
          } else {
            setData(result.result);
          }
          setLastDoc(result.lastDoc);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [
    checkingUserAuth,
    page,
    PAGE_SIZE,
    data,
    lastDoc,
    typeOfEnterprise,
    user,
  ]);

  const handleNextClick = () => {
    if (page === pages || loading) return;
    setPage((prev) => prev + 1);
  };

  if (checkingUserAuth || !data) {
    return (
      <div className="empty-wrapper | auto-height">
        <span className="loader-green | big-loader"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="enterprise-list">
        {data.map((enterprise, i) => (
          <div
            className="enterprise-item"
            data-state={
              selectedEnterprise &&
              selectedEnterprise.id === enterprise.id &&
              "selected"
            }
            key={i}
            onClick={() => selectEnterprise(enterprise)}
          >
            <div className="enterprise-item-header">
              <img
                className="enterprise-item-logo-bg"
                src={enterprise.logoImgUrl.url}
                alt=""
              />

              <img
                className="enterprise-item-logo"
                src={enterprise.logoImgUrl.url}
                alt=""
              />
            </div>
            <div className="enterprise-item-body">
              <h3 className="text | bold capitalize wrap">
                {cutTextWithDotsByLength(
                  enterprise.name,
                  MAX_LENGTH_FOR_NAMES_DISPLAY,
                )}
              </h3>
              <h4 className="text">{enterprise.location}</h4>
              <h4 className="text | circle purple | margin-top-25">
                {enterprise.phone}
              </h4>
            </div>
          </div>
        ))}
      </div>
      {page !== pages && (
        <div title={page === pages ? "No hay mas resultados" : "Cargar mas"}>
          <button
            className="icon-wrapper small-general-button text | bold gray-icon gray | margin-top-25 touchable"
            disabled={page === pages || loading}
            type="button"
            onClick={handleNextClick}
          >
            <Plus />
            Mostrar mas
          </button>
        </div>
      )}
    </div>
  );
};

export default BaseEnterpriseSelector;
